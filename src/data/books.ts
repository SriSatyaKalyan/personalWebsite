export type BookStatus = "reading" | "read";

export interface Book {
	title: string;
	author: string;
	status: BookStatus;
	isbn?: string; // ISBN-13 preferred; used for reliable cover lookup
}

export const books: Book[] = [
	// ── Currently reading ──────────────────────────────────────────
	{
		title: "Braiding Sweetgrass",
		author: "Robin Wall Kimmerer",
		status: "reading",
		isbn: "9781571313560",
	},
	{
		title: "The Ministry of Time",
		author: "Kaliane Bradley",
		status: "reading",
		isbn: "9780008619015",
	},
	{
		title: "The Dimensions of a Cave",
		author: "Greg Jackson",
		status: "reading",
		isbn: "9781250338273",
	},

	// ── Recently read ──────────────────────────────────────────────
	{
		title: "The Social Animal",
		author: "David Brooks",
		status: "read",
		isbn: "9780812979374",
	},
	{
		title: "The Midnight Library",
		author: "Matt Haig",
		status: "read",
		isbn: "9780525559474",
	},
	{
		title: "Dune",
		author: "Frank Herbert",
		status: "read",
		isbn: "9780143111580",
	},
	{
		title: "The Goldfinch",
		author: "Donna Tartt",
		status: "read",
		isbn: "9780316055437",
	},
	{
		title: "Bullshit Jobs: A Theory",
		author: "David Graeber",
		status: "read",
		isbn: "9781501143335",
	},
	{
		title: "Tomorrow, and Tomorrow, and Tomorrow",
		author: "Gabrielle Zevin",
		status: "read",
		isbn: "9780593321201",
	},
];
