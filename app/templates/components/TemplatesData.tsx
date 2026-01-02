export interface Template {
    id: number;
    name: string;
    category: string;
    aspectRatio: string;
    duration: number;
    style: string;
    thumbnail: string;
    isPremium: boolean;
}


export const TEMPLATES: Template[] = [
    { id: 1, name: "Vlog Intro", category: "YouTube", aspectRatio: "16:9", duration: 15, style: "Modern", thumbnail: "from-pink-500 to-purple-600", isPremium: false },
    { id: 2, name: "Product Showcase", category: "Business", aspectRatio: "16:9", duration: 30, style: "Minimal", thumbnail: "from-blue-500 to-cyan-500", isPremium: false },
    { id: 3, name: "Tutorial Opener", category: "Education", aspectRatio: "16:9", duration: 10, style: "Bold", thumbnail: "from-green-500 to-emerald-600", isPremium: true },
    { id: 4, name: "Music Video", category: "Creative", aspectRatio: "9:16", duration: 45, style: "Bold", thumbnail: "from-orange-500 to-red-600", isPremium: false },
    { id: 5, name: "Social Ad", category: "Marketing", aspectRatio: "1:1", duration: 15, style: "Modern", thumbnail: "from-violet-500 to-fuchsia-600", isPremium: false },
    { id: 6, name: "Testimonial", category: "Business", aspectRatio: "16:9", duration: 25, style: "Elegant", thumbnail: "from-teal-500 to-blue-600", isPremium: true },
    { id: 7, name: "Recipe Tutorial", category: "Education", aspectRatio: "4:5", duration: 60, style: "Minimal", thumbnail: "from-yellow-500 to-orange-500", isPremium: false },
    { id: 8, name: "Podcast Intro", category: "YouTube", aspectRatio: "16:9", duration: 20, style: "Elegant", thumbnail: "from-indigo-500 to-purple-600", isPremium: false },
    { id: 9, name: "Instagram Reel", category: "Social Media", aspectRatio: "9:16", duration: 15, style: "Bold", thumbnail: "from-pink-600 to-rose-600", isPremium: false },
    { id: 10, name: "TikTok Trend", category: "Social Media", aspectRatio: "9:16", duration: 30, style: "Modern", thumbnail: "from-cyan-500 to-blue-600", isPremium: true },
    { id: 11, name: "Corporate Promo", category: "Business", aspectRatio: "16:9", duration: 45, style: "Elegant", thumbnail: "from-slate-600 to-gray-800", isPremium: true },
    { id: 12, name: "Gaming Highlight", category: "Gaming", aspectRatio: "16:9", duration: 40, style: "Bold", thumbnail: "from-red-600 to-orange-600", isPremium: false },
];

export const CATEGORIES = ["All", "YouTube", "Business", "Education", "Marketing", "Social Media", "Creative", "Gaming"] as const;
export const ASPECT_RATIOS = ["All", "16:9", "9:16", "1:1", "4:5"] as const;
export const DURATIONS = ["All", "Under 15s", "15-30s", "30-60s", "60s+"] as const;
export const STYLES = ["All", "Modern", "Minimal", "Bold", "Elegant"] as const;

export type Category = typeof CATEGORIES[number];
export type AspectRatio = typeof ASPECT_RATIOS[number];
export type Duration = typeof DURATIONS[number];
export type Style = typeof STYLES[number];