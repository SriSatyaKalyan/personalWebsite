export type MovieStatus = "watching" | "watched";

export interface Movie {
	title: string;
	year?: number; // helps TMDB find the right film
	status: MovieStatus;
}

// ── Currently watching — update manually ──────────────────────────
export const currentlyWatching: Movie[] = [
	{ title: "The Night Agent", year: 2023, status: "watching" },
	{ title: "The Bear", year: 2022, status: "watching" },
];

// ── Recently watched — update manually ────────────────────────────
// Letterboxd diary entries are appended automatically after these.
export const recentlyWatched: Movie[] = [
	{ title: "Predator: Badlands", year: 2025, status: "watched" },
	{ title: "Inception", year: 2010, status: "watched" },
	{ title: "Over the Garden Wall", year: 2014, status: "watched" },
	{ title: "Project Hail Mary", year: 2026, status: "watched" },
	{ title: "The Gray Man", year: 2026, status: "watched" },
];
