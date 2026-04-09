import { useState, useEffect } from "react";
import { books, type Book } from "../data/books";

const CACHE_KEY = "book_covers_v5";
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours — covers rarely change

function bookListHash(bookList: Book[]): string {
	return bookList.map((b) => `${b.title}|${b.author}|${b.status}`).join(",");
}
export interface BookWithCover extends Book {
	coverUrl: string | null;
	openLibraryKey: string | null;
}

/** Check if an Open Library cover URL is a real image (not the 1×1 placeholder gif). */
async function isRealCover(url: string): Promise<boolean> {
	try {
		const res = await fetch(url, { method: "HEAD" });
		const size = Number(res.headers.get("content-length") ?? 0);
		return res.ok && size > 1000;
	} catch {
		return false;
	}
}

/** Try Google Books API by ISBN; returns a thumbnail URL or null. */
async function googleBooksCover(isbn: string): Promise<string | null> {
	try {
		const res = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&fields=items(volumeInfo/imageLinks)`,
		);
		const data = await res.json();
		const links = data?.items?.[0]?.volumeInfo?.imageLinks;
		const raw: string | undefined = links?.thumbnail ?? links?.smallThumbnail;
		if (!raw) return null;
		// Upgrade to HTTPS and request a larger zoom level
		return raw.replace("http://", "https://").replace("zoom=1", "zoom=2");
	} catch {
		return null;
	}
}

async function fetchCover(book: Book): Promise<BookWithCover> {
	const fields = "title,author_name,cover_i,key";

	async function olSearch(
		query: URLSearchParams,
	): Promise<{ cover_i?: number; key?: string } | null> {
		const res = await fetch(`https://openlibrary.org/search.json?${query}`);
		const data = await res.json();
		if (data.numFound > 0 && data.docs?.[0]) return data.docs[0];
		return null;
	}

	// ── Stage 1: Open Library ISBN cover (instant, most reliable) ────────────
	if (book.isbn) {
		const olIsbnUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
		if (await isRealCover(olIsbnUrl)) {
			const isbnData = await fetch(
				`https://openlibrary.org/isbn/${book.isbn}.json`,
			)
				.then((r) => r.json())
				.catch(() => null);
			return {
				...book,
				coverUrl: olIsbnUrl,
				openLibraryKey: isbnData?.works?.[0]?.key ?? null,
			};
		}
	}

	// ── Stage 2: Google Books by ISBN (great for newer releases) ─────────────
	if (book.isbn) {
		const gbUrl = await googleBooksCover(book.isbn);
		if (gbUrl) {
			return { ...book, coverUrl: gbUrl, openLibraryKey: null };
		}
	}

	// ── Stage 3 & 4: Open Library title + author search ──────────────────────
	try {
		const strictParams = new URLSearchParams({
			title: book.title,
			author: book.author,
			limit: "1",
			fields,
		});
		let doc = await olSearch(strictParams);

		if (!doc?.cover_i) {
			const broadParams = new URLSearchParams({
				q: `${book.title} ${book.author}`,
				limit: "1",
				fields,
			});
			doc = await olSearch(broadParams);
		}

		return {
			...book,
			coverUrl: doc?.cover_i
				? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
				: null,
			openLibraryKey: doc?.key ?? null,
		};
	} catch {
		return { ...book, coverUrl: null, openLibraryKey: null };
	}
}

export function useBookCovers() {
	const [booksWithCovers, setBooksWithCovers] = useState<BookWithCover[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const hash = bookListHash(books);
		// Try cache first
		try {
			const raw = localStorage.getItem(CACHE_KEY);
			if (raw) {
				const {
					data,
					ts,
					hash: cachedHash,
				} = JSON.parse(raw) as {
					data: BookWithCover[];
					ts: number;
					hash: string;
				};
				if (Date.now() - ts < CACHE_TTL && cachedHash === hash) {
					setBooksWithCovers(data);
					setLoading(false);
					return;
				}
			}
		} catch {
			/* ignore corrupt cache */
		}

		// Fetch all covers in parallel
		Promise.all(books.map(fetchCover)).then((results) => {
			setBooksWithCovers(results);
			setLoading(false);
			try {
				localStorage.setItem(
					CACHE_KEY,
					JSON.stringify({ data: results, ts: Date.now(), hash }),
				);
			} catch {
				/* storage full */
			}
		});
	}, []);

	return {
		loading,
		reading: booksWithCovers.filter((b) => b.status === "reading"),
		read: booksWithCovers.filter((b) => b.status === "read"),
	};
}
