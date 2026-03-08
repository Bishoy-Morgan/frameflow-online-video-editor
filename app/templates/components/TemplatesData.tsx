const BASE = 'https://gvcbfsfglzhbxmsyuylg.supabase.co/storage/v1/object/public/template-previews'

function videos(slug: string): [string, string, string] {
    const titled = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-')
    return [`${BASE}/${titled}-1.mp4`, `${BASE}/${titled}-2.mp4`, `${BASE}/${titled}-3.mp4`]
}

export interface TemplateScene {
    title:       string
    description: string
    musicMood:   string
    duration:    number
    order:       number
}

export interface Template {
    id:            number
    name:          string
    category:      string
    aspectRatio:   string
    duration:      number
    style:         string
    thumbnail:     string
    isPremium:     boolean
    description:   string
    previewVideos: [string, string, string]
    scenes:        TemplateScene[]
}

export const TEMPLATES: Template[] = [
    {
        id: 1,
        name: "Vlog Intro",
        category: "YouTube",
        aspectRatio: "16:9",
        duration: 15,
        style: "Modern",
        thumbnail: "from-pink-500 to-purple-600",
        isPremium: false,
        description: "A punchy, energetic intro to kick off your vlog with personality.",
        previewVideos: videos('vlog-intro'),
        scenes: [
            { title: "Hook Shot",   description: "Open with your most exciting moment from the vlog — grab attention immediately.", musicMood: "Energetic", duration: 4, order: 0 },
            { title: "Title Card",  description: "Display the vlog title with animated text over a scenic or personal shot.",       musicMood: "Uplifting", duration: 5, order: 1 },
            { title: "Day Preview", description: "Quick 3-second montage teasing what's coming in the full video.",                musicMood: "Uplifting", duration: 6, order: 2 },
        ]
    },
    {
        id: 2,
        name: "Product Showcase",
        category: "Business",
        aspectRatio: "16:9",
        duration: 30,
        style: "Minimal",
        thumbnail: "from-blue-500 to-cyan-500",
        isPremium: false,
        description: "Clean and professional product reveal for e-commerce or SaaS.",
        previewVideos: videos('product-showcase'),
        scenes: [
            { title: "Problem Statement", description: "Open with the pain point your product solves — make it relatable and direct.",      musicMood: "Dramatic",  duration: 6,  order: 0 },
            { title: "Product Reveal",    description: "Slow reveal of the product with clean background and subtle zoom-in effect.",       musicMood: "Cinematic", duration: 8,  order: 1 },
            { title: "Key Features",      description: "Three quick feature callouts with icons and short text overlays.",                  musicMood: "Uplifting", duration: 10, order: 2 },
            { title: "Call to Action",    description: "End with a clear CTA — website URL, discount code, or 'Shop Now' button overlay.", musicMood: "Uplifting", duration: 6,  order: 3 },
        ]
    },
    {
        id: 3,
        name: "Tutorial Opener",
        category: "Education",
        aspectRatio: "16:9",
        duration: 10,
        style: "Bold",
        thumbnail: "from-green-500 to-emerald-600",
        isPremium: true,
        description: "An authoritative opener that sets up your tutorial with clarity.",
        previewVideos: videos('tutorial-opener'),
        scenes: [
            { title: "What You'll Learn", description: "State the outcome upfront — what skill or knowledge the viewer will walk away with.", musicMood: "Calm",      duration: 4, order: 0 },
            { title: "Your Intro",        description: "Brief 3-second host introduction to build trust and authority.",                      musicMood: "Uplifting", duration: 3, order: 1 },
            { title: "Agenda",            description: "Quick visual breakdown of the steps covered in the tutorial.",                        musicMood: "Calm",      duration: 3, order: 2 },
        ]
    },
    {
        id: 4,
        name: "Music Video",
        category: "Creative",
        aspectRatio: "9:16",
        duration: 45,
        style: "Bold",
        thumbnail: "from-orange-500 to-red-600",
        isPremium: false,
        description: "High-energy vertical music video optimized for Reels and TikTok.",
        previewVideos: videos('music-video'),
        scenes: [
            { title: "Establishing Shot", description: "Open with a wide or silhouette shot that sets the mood and visual tone.",             musicMood: "Dramatic",    duration: 8,  order: 0 },
            { title: "Verse Montage",     description: "Fast-cut sequence of performance or lifestyle shots synced to the beat.",             musicMood: "Energetic",   duration: 12, order: 1 },
            { title: "Chorus Drop",       description: "The highest-energy segment — use your best footage and biggest visual moments here.", musicMood: "Energetic",   duration: 10, order: 2 },
            { title: "Bridge",            description: "Slow it down briefly — one strong close-up or emotional shot before the final push.", musicMood: "Melancholic", duration: 8,  order: 3 },
            { title: "Final Chorus",      description: "Go bigger than the first chorus — build to the visual and musical peak.",             musicMood: "Energetic",   duration: 7,  order: 4 },
        ]
    },
    {
        id: 5,
        name: "Social Ad",
        category: "Marketing",
        aspectRatio: "1:1",
        duration: 15,
        style: "Modern",
        thumbnail: "from-violet-500 to-fuchsia-600",
        isPremium: false,
        description: "Scroll-stopping square ad for Instagram, Facebook and LinkedIn feeds.",
        previewVideos: videos('social-ad'),
        scenes: [
            { title: "Pattern Interrupt", description: "Open with something unexpected — bold text, a question, or a surprising visual.", musicMood: "Energetic", duration: 3, order: 0 },
            { title: "Value Prop",        description: "State your core offer in one clear sentence with visual support.",                 musicMood: "Uplifting", duration: 7, order: 1 },
            { title: "CTA",               description: "Direct and urgent call to action — 'Get 50% Off Today' or 'Start Free Trial'.",   musicMood: "Uplifting", duration: 5, order: 2 },
        ]
    },
    {
        id: 6,
        name: "Testimonial",
        category: "Business",
        aspectRatio: "16:9",
        duration: 25,
        style: "Elegant",
        thumbnail: "from-teal-500 to-blue-600",
        isPremium: true,
        description: "Polished customer story that builds trust and drives conversions.",
        previewVideos: videos('testimonial'),
        scenes: [
            { title: "Customer Intro",    description: "Brief intro of the customer — name, role, and context for credibility.",           musicMood: "Calm",      duration: 5, order: 0 },
            { title: "The Problem",       description: "Customer describes their situation before using your product in their own words.", musicMood: "Calm",      duration: 7, order: 1 },
            { title: "The Turning Point", description: "The moment they discovered or started using your product.",                       musicMood: "Uplifting", duration: 7, order: 2 },
            { title: "The Result",        description: "Specific outcome — numbers, time saved, or emotional transformation.",            musicMood: "Uplifting", duration: 6, order: 3 },
        ]
    },
    {
        id: 7,
        name: "Recipe Tutorial",
        category: "Education",
        aspectRatio: "4:5",
        duration: 60,
        style: "Minimal",
        thumbnail: "from-yellow-500 to-orange-500",
        isPremium: false,
        description: "Step-by-step recipe video optimized for food creators and brands.",
        previewVideos: videos('recipe-tutorial'),
        scenes: [
            { title: "Final Dish Reveal", description: "Open with the finished dish to hook viewers immediately — make it look irresistible.", musicMood: "Playful",   duration: 5,  order: 0 },
            { title: "Ingredients",       description: "Flat-lay shot of all ingredients with text labels. Clean and organized.",             musicMood: "Calm",      duration: 8,  order: 1 },
            { title: "Prep",              description: "Chopping, measuring, and mise en place — fast cuts keep energy high.",                musicMood: "Playful",   duration: 12, order: 2 },
            { title: "Cooking",           description: "The main cooking process — sizzle, steam, color change. Make it sensory.",           musicMood: "Playful",   duration: 18, order: 3 },
            { title: "Plating",           description: "Slow, satisfying plating sequence — this is the ASMR moment.",                      musicMood: "Calm",      duration: 10, order: 4 },
            { title: "Taste Reaction",    description: "Authentic reaction and final summary — invite viewers to try it.",                   musicMood: "Uplifting", duration: 7,  order: 5 },
        ]
    },
    {
        id: 8,
        name: "Podcast Intro",
        category: "YouTube",
        aspectRatio: "16:9",
        duration: 20,
        style: "Elegant",
        thumbnail: "from-indigo-500 to-purple-600",
        isPremium: false,
        description: "A cinematic, branded podcast intro for YouTube and Spotify.",
        previewVideos: videos('podcast-intro'),
        scenes: [
            { title: "Show Brand",    description: "Animated show logo or name with a strong music sting.",                            musicMood: "Cinematic", duration: 4, order: 0 },
            { title: "Episode Hook",  description: "The most compelling clip or quote from this episode — make people want to stay.", musicMood: "Dramatic",  duration: 8, order: 1 },
            { title: "Episode Title", description: "Episode number, title, and guest name with clean typographic treatment.",          musicMood: "Cinematic", duration: 5, order: 2 },
            { title: "Subscribe CTA", description: "Quick 3-second subscribe/follow reminder before the episode begins.",             musicMood: "Uplifting", duration: 3, order: 3 },
        ]
    },
    {
        id: 9,
        name: "Instagram Reel",
        category: "Social Media",
        aspectRatio: "9:16",
        duration: 15,
        style: "Bold",
        thumbnail: "from-pink-600 to-rose-600",
        isPremium: false,
        description: "Fast-paced vertical Reel designed to maximize watch time and shares.",
        previewVideos: videos('instagram-reel'),
        scenes: [
            { title: "Hook (0-3s)",    description: "The most important 3 seconds — bold text or surprising visual to stop the scroll.", musicMood: "Energetic", duration: 3, order: 0 },
            { title: "Value Delivery", description: "Quick, punchy content delivery — tips, transformation, or story moment.",           musicMood: "Energetic", duration: 8, order: 1 },
            { title: "Engagement CTA", description: "End with a question or prompt to drive comments and shares.",                      musicMood: "Uplifting", duration: 4, order: 2 },
        ]
    },
    {
        id: 10,
        name: "TikTok Trend",
        category: "Social Media",
        aspectRatio: "9:16",
        duration: 30,
        style: "Modern",
        thumbnail: "from-cyan-500 to-blue-600",
        isPremium: true,
        description: "Trend-native TikTok format built for virality and algorithm reach.",
        previewVideos: videos('tiktok-trend'),
        scenes: [
            { title: "Trend Hook",    description: "Jump straight into the trending format, sound, or challenge — no buildup.",  musicMood: "Energetic", duration: 5,  order: 0 },
            { title: "Your Spin",     description: "Your unique take on the trend — this is what makes it shareable.",           musicMood: "Energetic", duration: 12, order: 1 },
            { title: "Reaction",      description: "Authentic reaction or punchline — the payoff moment.",                      musicMood: "Playful",   duration: 8,  order: 2 },
            { title: "Follow Prompt", description: "Natural follow/duet/stitch prompt without feeling forced.",                 musicMood: "Uplifting", duration: 5,  order: 3 },
        ]
    },
    {
        id: 11,
        name: "Corporate Promo",
        category: "Business",
        aspectRatio: "16:9",
        duration: 45,
        style: "Elegant",
        thumbnail: "from-slate-600 to-gray-800",
        isPremium: true,
        description: "Premium corporate brand film for presentations, LinkedIn and websites.",
        previewVideos: videos('corporate-promo'),
        scenes: [
            { title: "Brand Manifesto",   description: "Opening statement of your company's mission or vision — big and bold.",            musicMood: "Cinematic", duration: 8,  order: 0 },
            { title: "Team & Culture",    description: "Authentic team moments that humanize the brand — offices, collaboration, energy.", musicMood: "Uplifting", duration: 10, order: 1 },
            { title: "Product / Service", description: "Clean showcase of what you deliver — focus on quality and outcome.",               musicMood: "Cinematic", duration: 10, order: 2 },
            { title: "Client Proof",      description: "Brief social proof — logos, testimonial quote, or key metric.",                    musicMood: "Calm",      duration: 8,  order: 3 },
            { title: "Vision Statement",  description: "Forward-looking close — where you're going and why it matters.",                   musicMood: "Cinematic", duration: 9,  order: 4 },
        ]
    },
    {
        id: 12,
        name: "Gaming Highlight",
        category: "Gaming",
        aspectRatio: "16:9",
        duration: 40,
        style: "Bold",
        thumbnail: "from-red-600 to-orange-600",
        isPremium: false,
        description: "High-octane gaming highlight reel for YouTube and Twitch clips.",
        previewVideos: videos('gaming-highlight'),
        scenes: [
            { title: "Best Clip Teaser", description: "Open with your most insane moment — cut right to the peak action.",              musicMood: "Dramatic",  duration: 6,  order: 0 },
            { title: "Intro Card",       description: "Channel branding with gamer tag, game title, and episode number.",               musicMood: "Energetic", duration: 4,  order: 1 },
            { title: "Highlight Reel",   description: "Rapid-fire sequence of your best plays — edit to the beat drops.",              musicMood: "Energetic", duration: 20, order: 2 },
            { title: "Reaction Cam",     description: "Your face-cam reaction to the highlight — authentic emotion drives engagement.", musicMood: "Playful",   duration: 6,  order: 3 },
            { title: "Subscribe Outro",  description: "Animated outro with subscribe button and next video recommendation.",            musicMood: "Uplifting", duration: 4,  order: 4 },
        ]
    },
]

export const CATEGORIES    = ["All", "YouTube", "Business", "Education", "Marketing", "Social Media", "Creative", "Gaming"] as const
export const ASPECT_RATIOS = ["All", "16:9", "9:16", "1:1", "4:5"] as const
export const DURATIONS     = ["All", "Under 15s", "15-30s", "30-60s", "60s+"] as const
export const STYLES        = ["All", "Modern", "Minimal", "Bold", "Elegant"] as const

export type Category    = typeof CATEGORIES[number]
export type AspectRatio = typeof ASPECT_RATIOS[number]
export type Duration    = typeof DURATIONS[number]
export type Style       = typeof STYLES[number]