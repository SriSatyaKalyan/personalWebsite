import { useState, useEffect } from "react";
import { books, type Book } from "../data/books";

const CACHE_KEY = "book_covers_v2";
// const CACHE_TTL = 1 * 60 * 1000; // 1 minute — covers change
const CACHE_TTL = 24 * 60 * 60 * 1000; // 1 day — covers rarely change

function bookListHash(bookList: Book[]): string {
	return bookList.map((b) => `${b.title}|${b.author}|${b.status}`).join(",");
}
export interface BookWithCover extends Book {
	coverUrl: string | null;
	openLibraryKey: string | null;
}

async function fetchCover(book: Book): Promise<BookWithCover> {
	try {
		const params = new URLSearchParams({
			title: book.title,
			author: book.author,
			limit: "1",
			fields: "title,author_name,cover_i,key",
		});
		const res = await fetch(
			`https://openlibrary.org/search.json?${params}`,
		);
		const data = await res.json();
		const doc = data.docs?.[0];
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
