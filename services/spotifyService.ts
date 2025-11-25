
import { Track, AudioFeatures, MusicSeason } from "../types";

// --- MOCK DATA UTILITIES ---

const determineSeason = (features: AudioFeatures): MusicSeason => {
    // Logic mapping audio features to inner seasons
    const { energy, valence, acousticness } = features;

    if (energy > 0.7 && valence > 0.6) return 'Summer'; // High energy, happy = Summer
    if (energy < 0.4 && valence < 0.4) return 'Winter'; // Low energy, sad/melancholy = Winter
    if (acousticness > 0.6 && valence > 0.4) return 'Spring'; // Acoustic, light = Spring
    
    // Fallback / Complex emotional mix
    return 'Autumn'; // Nostalgic, mid-tempo, complex
};

const MOCK_TRACKS_DATA = [
    { title: "Weightless", artist: "Marconi Union", genre: "Ambient", features: { energy: 0.1, valence: 0.05, tempo: 60, acousticness: 0.9, danceability: 0.1, instrumentalness: 0.9 } },
    { title: "Midnight City", artist: "M83", genre: "Synthpop", features: { energy: 0.8, valence: 0.6, tempo: 120, acousticness: 0.01, danceability: 0.7, instrumentalness: 0.4 } },
    { title: "Holocene", artist: "Bon Iver", genre: "Indie Folk", features: { energy: 0.3, valence: 0.2, tempo: 75, acousticness: 0.8, danceability: 0.3, instrumentalness: 0.1 } },
    { title: "Can't Stop", artist: "Red Hot Chili Peppers", genre: "Rock", features: { energy: 0.9, valence: 0.8, tempo: 130, acousticness: 0.05, danceability: 0.8, instrumentalness: 0.0 } },
    { title: "Cornfield Chase", artist: "Hans Zimmer", genre: "Score", features: { energy: 0.4, valence: 0.3, tempo: 90, acousticness: 0.6, danceability: 0.1, instrumentalness: 0.8 } },
    { title: "Good Days", artist: "SZA", genre: "R&B", features: { energy: 0.6, valence: 0.7, tempo: 110, acousticness: 0.4, danceability: 0.6, instrumentalness: 0.0 } },
    { title: "Nuvole Bianche", artist: "Ludovico Einaudi", genre: "Classical", features: { energy: 0.2, valence: 0.1, tempo: 60, acousticness: 0.95, danceability: 0.2, instrumentalness: 0.9 } },
    { title: "Experience", artist: "Ludovico Einaudi", genre: "Classical", features: { energy: 0.5, valence: 0.4, tempo: 90, acousticness: 0.7, danceability: 0.3, instrumentalness: 0.8 } },
    { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop", features: { energy: 0.9, valence: 0.8, tempo: 170, acousticness: 0.1, danceability: 0.8, instrumentalness: 0.0 } },
    { title: "Clair de Lune", artist: "Claude Debussy", genre: "Classical", features: { energy: 0.1, valence: 0.1, tempo: 50, acousticness: 0.99, danceability: 0.2, instrumentalness: 0.9 } }
];

// --- SERVICE METHODS ---

export const getRecentTracks = async (limit: number = 10): Promise<Track[]> => {
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const tracks: Track[] = Array.from({ length: limit }).map((_, i) => {
        const mock = MOCK_TRACKS_DATA[Math.floor(Math.random() * MOCK_TRACKS_DATA.length)];
        // Add slight variation to features to make data look organic
        const features: AudioFeatures = {
            energy: Math.max(0, Math.min(1, mock.features.energy + (Math.random() * 0.2 - 0.1))),
            valence: Math.max(0, Math.min(1, mock.features.valence + (Math.random() * 0.2 - 0.1))),
            acousticness: Math.max(0, Math.min(1, mock.features.acousticness + (Math.random() * 0.2 - 0.1))),
            danceability: mock.features.danceability,
            tempo: mock.features.tempo,
            instrumentalness: mock.features.instrumentalness
        };

        return {
            id: `track-${Date.now()}-${i}`,
            title: mock.title,
            artist: mock.artist,
            album: "Greatest Hits",
            coverUrl: `https://source.unsplash.com/random/300x300?abstract,music,${i}`, // Using unsplash for mock
            durationMs: 180000 + Math.random() * 60000,
            playedAt: new Date(Date.now() - i * 1000 * 60 * 45), // Every 45 mins
            features,
            season: determineSeason(features),
            genre: mock.genre
        };
    });

    return tracks;
};

export const getNovaMusicWhisper = (season: MusicSeason, language: 'en' | 'vi' = 'en'): string => {
    const whispers = {
        vi: {
            Spring: "Bài nhạc này giống hơi thở đầu ngày. Nhẹ nhưng mang theo mở cửa.",
            Summer: "Âm thanh này đẩy mày tiến xa hơn một chút. Nó sáng và đầy nhịp.",
            Autumn: "Có một lớp trầm rất thật trong bài này. Giống cách mày đang trưởng thành.",
            Winter: "Tiếng này giống như một góc yên trong tâm trí mày. Một nơi để dừng lại."
        },
        en: {
            Spring: "This track feels like the first breath of morning. Gentle, yet it opens a door.",
            Summer: "This sound pushes you further. Bright, rhythmic, and driving.",
            Autumn: "There is a layer of truth in this bass. It mirrors how you are maturing.",
            Winter: "This sound is a quiet corner in your mind. A place to stop."
        }
    };
    return whispers[language][season];
};
