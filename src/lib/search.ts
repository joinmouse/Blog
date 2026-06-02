import MiniSearch from 'minisearch';

let miniSearch: MiniSearch | null = null;
let loadPromise: Promise<MiniSearch> | null = null;

async function loadIndex(): Promise<MiniSearch> {
  if (miniSearch) return miniSearch;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const res = await fetch('/search-index.json');
    const docs = await res.json();

    const ms = new MiniSearch({
      fields: ['title', 'tags', 'body'],
      storeFields: ['slug', 'title', 'date', 'tags', 'category'],
      searchOptions: {
        boost: { title: 3, tags: 2 },
        prefix: true,
        fuzzy: 0.2,
      },
      // Chinese-aware tokenizer: split on CJK char boundaries + whitespace
      tokenize: (text: string) => {
        const tokens: string[] = [];
        // Split into CJK single chars and non-CJK words
        const parts = text.split(/([\u4e00-\u9fff\u3400-\u4dbf])/);
        let buffer = '';
        for (const part of parts) {
          if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(part)) {
            if (buffer) { tokens.push(buffer.toLowerCase()); buffer = ''; }
            tokens.push(part);
          } else {
            const words = part.split(/\s+/);
            for (const w of words) {
              if (w) buffer += (buffer ? ' ' : '') + w;
            }
          }
        }
        if (buffer) tokens.push(buffer.toLowerCase());
        return tokens;
      },
    });

    ms.addAll(docs);
    miniSearch = ms;
    return ms;
  })();

  return loadPromise;
}

export interface SearchResult {
  slug: string;
  title: string;
  date: string;
  tags: string;
  category: string;
  score: number;
}

export async function search(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const ms = await loadIndex();
  const results = ms.search(query) as any[];
  return results.slice(0, 10).map((r: any) => ({
    slug: r.slug,
    title: r.title,
    date: r.date,
    tags: r.tags,
    category: r.category,
    score: r.score,
  }));
}
