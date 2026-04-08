export type BookStatus = "reading" | "read";

export interface Book {
	title: string;
	author: string;
	status: BookStatus;
}

export const books: Book[] = [
	// ── Currently reading ──────────────────────────────────────────
	{
		title: "Braiding Sweetgrass",
		author: "Robin Wall Kimmerer",
		status: "reading",
	},
	{
		title: "The Ministry of Time",
		author: "Kaliane Bradley",
		status: "reading",
	},

	// ── Recently read ──────────────────────────────────────────────
	{ title: "The Social Animal", author: "David Brooks", status: "read" },
	{ title: "The Midnight Library", author: "Matt Haig", status: "read" },
	{ title: "Dune", author: "Frank Herbert", status: "read" },
	{ title: "The Goldfinch", author: "Donna Tartt", status: "read" },
	// {
	// 	title: "The Dimensions of a Cave",
	// 	author: "Greg Jackson",
	// 	status: "read",
	// },
	{
		title: "Tomorrow, and Tomorrow, and Tomorrow",
		author: "Gabrielle Zevin",
		status: "read",
	},
];
