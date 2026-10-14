import { SearchableQuickItem } from './types';

export function cn(...classes: Array<string | false | null | undefined>): string {
 return classes.filter(Boolean).join(' ');
}

export function formatCompactNumber(num: number): string {
 return Intl.NumberFormat('en-US', {
   notation: 'compact',
   maximumFractionDigits: 1,
 }).format(num);
}

export function formatRelativeDate(isoDate: string): string {
 const date = new Date(isoDate);
 const now = new Date('2026-10-15T12:00:00Z');
 const diffMs = now.getTime() - date.getTime();
 const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));

 if (diffHours < 24) {
   return `${diffHours}h ago`;
 }
 const diffDays = Math.floor(diffHours / 24);
 if (diffDays < 7) {
   return `${diffDays}d ago`;
 }
 return date.toLocaleDateString('en-US', {
   month: 'short',
   day: 'numeric',
   year: 'numeric',
 });
}

export interface FuzzyMatchResult {
 score: number;
 matchedIndices: number[];
}

/**
* Lightweight, zero-allocation-heavy fuzzy matcher returning score and character indices
* for instant match highlighting without external library overhead.
*/
export function fuzzyMatch(text: string, query: string): FuzzyMatchResult | null {
 const cleanQuery = query.trim().toLowerCase();
 if (!cleanQuery) return { score: 1, matchedIndices: [] };

 const lowerText = text.toLowerCase();
 const exactIndex = lowerText.indexOf(cleanQuery);

 if (exactIndex !== -1) {
   const indices: number[] = [];
   for (let i = 0; i < cleanQuery.length; i++) {
     indices.push(exactIndex + i);
   }
   const startBonus = exactIndex === 0 ? 50 : 25;
   return {
     score: 100 + startBonus - exactIndex * 0.5,
     matchedIndices: indices,
   };
 }

 let queryIdx = 0;
 let score = 0;
 let consecutive = 0;
 const matchedIndices: number[] = [];

 for (let i = 0; i < lowerText.length && queryIdx < cleanQuery.length; i++) {
   if (lowerText[i] === cleanQuery[queryIdx]) {
     matchedIndices.push(i);
     consecutive += 1;
     score += 10 + consecutive * 6;
     if (i === 0 || lowerText[i - 1] === ' ' || lowerText[i - 1] === '-') {
       score += 12;
     }
     queryIdx++;
   } else {
     consecutive = 0;
     score -= 0.4;
   }
 }

 if (queryIdx !== cleanQuery.length) {
   return null;
 }

 return { score, matchedIndices };
}

/**
* Splits a string into segments for safe React rendering with highlighted match spans.
*/
export function buildHighlightSegments(
 text: string,
 matchedIndices: number[]
): Array<{ text: string; highlight: boolean }> {
 if (!matchedIndices.length) {
   return [{ text, highlight: false }];
 }

 const indexSet = new Set(matchedIndices);
 const segments: Array<{ text: string; highlight: boolean }> = [];
 let current = '';
 let currentHighlight = indexSet.has(0);

 for (let i = 0; i < text.length; i++) {
   const isMatch = indexSet.has(i);
   if (isMatch !== currentHighlight && current.length > 0) {
     segments.push({ text: current, highlight: currentHighlight });
     current = text[i];
     currentHighlight = isMatch;
   } else {
     current += text[i];
   }
 }

 if (current.length > 0) {
   segments.push({ text: current, highlight: currentHighlight });
 }

 return segments;
}

/**
* Initial quick-search index used by Command Palette before or alongside full seed registries.
*/
export const INITIAL_QUICK_INDEX: SearchableQuickItem[] = [
 {
   id: 'nav-home',
   type: 'nav',
   title: 'Index / Spatial Home',
   subtitle: 'Overview, architecture story, trending directory & dispatches',
   meta: 'Route',
   href: '/',
 },
 {
   id: 'nav-apps',
   type: 'nav',
   title: 'Apps & AI Tools Directory',
   subtitle: '30 benchmarked autonomous tools, models, and spatial engines',
   meta: 'Pillar 01',
   href: '/apps',
 },
 {
   id: 'nav-news',
   type: 'nav',
   title: 'AI News & Dispatches',
   subtitle: '24 verified research breakthroughs, model releases, and policy briefs',
   meta: 'Pillar 02',
   href: '/news',
 },
 {
   id: 'app-astra-reasoner',
   type: 'app',
   title: 'Astra-6 Omni Reasoner',
   subtitle: 'Deterministic multi-step synthesis with formal verification',
   meta: 'Foundation Models · 9.9',
   href: '/apps/astra-6-omni-reasoner',
 },
 {
   id: 'app-kinetix-code',
   type: 'app',
   title: 'Kinetix Kernel IDE',
   subtitle: 'Zero-latency repository-scale autonomous systems engineering',
   meta: 'Code & Engineering · 9.8',
   href: '/apps/kinetix-kernel-ide',
 },
 {
   id: 'app-chronos-spatial',
   type: 'app',
   title: 'Chronos World Model 4D',
   subtitle: 'Physically grounded neural radiance and rigid-body simulation',
   meta: 'Spatial & 3D · 9.7',
   href: '/apps/chronos-world-model-4d',
 },
 {
   id: 'app-veritas-lab',
   type: 'app',
   title: 'Veritas Theorem Synthesizer',
   subtitle: 'Automated Lean-4 mathematical proof discovery and paper auditing',
   meta: 'Research & Reasoning · 9.7',
   href: '/apps/veritas-theorem-synthesizer',
 },
 {
   id: 'news-sub-quadratic',
   type: 'news',
   title: 'Sub-Quadratic State Space Architectures Surpass Dense Transformers at 10M Context',
   subtitle: 'Primary benchmark validation confirms 78% memory reduction with zero recall degradation.',
   meta: 'Models · 5m read',
   href: '/news/sub-quadratic-state-space-10m-context',
 },
 {
   id: 'news-zero-hallucination',
   type: 'news',
   title: 'Formal Proof-Carrying Code Becomes Mandatory Across European Sovereign Cloud',
   subtitle: 'New Brussels directive requires cryptographic verification certificates for autonomous deployments.',
   meta: 'Policy · 6m read',
   href: '/news/formal-proof-carrying-code-sovereign-cloud',
 },
];
