export type AppCategorySlug =
 | 'foundation-models'
 | 'code-engineering'
 | 'visual-synthesis'
 | 'autonomous-agents'
 | 'audio-voice'
 | 'research-reasoning'
 | 'spatial-3d'
 | 'productivity-ops';

export type PricingTier = 'Free' | 'Freemium' | 'Usage-Based' | 'Enterprise';

export type PlatformType = 'Web' | 'macOS' | 'Windows' | 'iOS' | 'Android' | 'API' | 'CLI' | 'Self-Hosted';

export interface AppItem {
 id: string;
 slug: string;
 name: string;
 tagline: string;
 description: string;
 editorialVerdict: string;
 category: AppCategorySlug;
 categoryLabel: string;
 pricing: PricingTier;
 startingPrice: string;
 platforms: PlatformType[];
 rating: number;
 reviewCount: number;
 latencyMs: number;
 contextWindow: string;
 releaseDate: string; // ISO YYYY-MM-DD
 featured?: boolean;
 trendingRank?: number;
 verifiedBenchmark: string;
 websiteUrl: string;
 iconGlyph: string;
 accentTone: string;
 features: string[];
 pros: string[];
 cons: string[];
 screenshots: {
   id: string;
   title: string;
   caption: string;
   aspect: '16:10';
   surfaceCode: string;
 }[];
 alternatives: string[]; // slugs
}

export interface CategoryInfo {
 slug: AppCategorySlug;
 name: string;
 shortName: string;
 editorialIntro: string;
 thesis: string;
 metricLabel: string;
 metricValue: string;
}

export type NewsTopic =
 | 'models'
 | 'tools'
 | 'research'
 | 'funding'
 | 'policy'
 | 'open-source';

export interface NewsSource {
 id: string;
 name: string;
 domain: string;
 credibilityTier: 'Primary Lab' | 'Peer-Reviewed' | 'Tier-1 Tech' | 'Policy Institute';
}

export interface NewsArticle {
 id: string;
 slug: string;
 title: string;
 subtitle: string;
 summary: string;
 tldrBullets: string[];
 topic: NewsTopic;
 source: NewsSource;
 publishedAt: string; // ISO string
 timeframeBucket: 'today' | 'week' | 'month';
 readTimeMinutes: number;
 author: {
   name: string;
   role: string;
 };
 isLeadStory?: boolean;
 isBreaking?: boolean;
 pullQuote: {
   text: string;
   attribution: string;
 };
 sections: {
   id: string;
   heading: string;
   paragraphs: string[];
 }[];
 relatedAppSlugs: string[];
}

export interface SearchableQuickItem {
 id: string;
 type: 'app' | 'news' | 'nav';
 title: string;
 subtitle: string;
 meta: string;
 href: string;
}
