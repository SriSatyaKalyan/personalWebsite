export interface Song {
	id: string; // YouTube video ID
	title: string;
	artist: string;
	coverUrl?: string; // optional override; defaults to YouTube thumbnail
}

export const songs: Song[] = [
	// Add your songs here — id is the YouTube video ID (e.g. "dQw4w9WgXcQ" from youtube.com/watch?v=dQw4w9WgXcQ)
	{
		id: "jfKfPfyJRdk",
		title: "Lofi Hip Hop Radio",
		artist: "Lofi Girl",
	},
	{
		id: "SGFXdO-AjU0",
		title: "Aa Jao Meri Tamanna",
		artist: "Pritam",
	},
	{
		id: "Cb--jzFdDhU",
		title: "Kiliye Kiliye - Remix",
		artist: "ChilledCow",
	},
	{
		id: "AYcM-F75hh0",
		title: "No Way To Relax When You Are On Fire",
		artist: "Dora Jar",
	},
];

export function getSongCover(song: Song): string {
	return (
		song.coverUrl ?? `https://img.youtube.com/vi/${song.id}/mqdefault.jpg`
	);
}
