
import { WikiConcept } from '../types';

// Mock AI functions
const generateInsights = async (text: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const sentences = text.replace(/<[^>]*>?/gm, '').split('. ').filter(s => s.length > 20);
  // Pick 3 random sentences as "insights"
  const shuffled = sentences.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3).map(s => s.trim() + '.');
};

const generateReflection = async (title: string, text: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const intros = [
    "This concept resonates with a structure I've seen in your recent thoughts.",
    "A fascinating fragment. It reminds me of the 'Builder' archetype you are cultivating.",
    "This knowledge seems to bridge the gap between intuition and logic.",
    "Observe how this idea sits in your mind. Is it a tool or a destination?",
    "Perhaps this is the missing link in your current project."
  ];
  return `${intros[Math.floor(Math.random() * intros.length)]} The essence of '${title}' mirrors a pattern of internal growth.`;
};

// Wikipedia API Wrapper
export const searchWikipedia = async (query: string, primaryLang: string = 'en'): Promise<WikiConcept[]> => {
  if (!query.trim()) return [];

  const langs = ['en', 'vi']; // Supported languages
  
  const promises = langs.map(async (lang) => {
      const url = `https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=5&namespace=0&format=json&origin=*`;
      try {
          const response = await fetch(url);
          const data = await response.json();
          // data format: [query, [titles], [descriptions], [urls]]
          const titles = data[1];
          const descriptions = data[2];
          const urls = data[3];
          
          return titles.map((title: string, index: number) => ({
              id: `${lang}-${title.replace(/\s+/g, '_')}`, // Unique ID per lang
              title,
              extract: descriptions[index] || (lang === 'vi' ? 'Không có mô tả ngắn.' : 'No description available.'),
              url: urls[index],
              language: lang,
              createdAt: new Date().toISOString()
          })) as WikiConcept[];
      } catch (e) {
          console.error(`Error searching ${lang}:`, e);
          return [];
      }
  });

  const results = (await Promise.all(promises)).flat();

  // Sort: Exact matches first, then by primary language
  return results.sort((a, b) => {
      const aExact = a.title.toLowerCase() === query.toLowerCase();
      const bExact = b.title.toLowerCase() === query.toLowerCase();
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      if (a.language === primaryLang && b.language !== primaryLang) return -1;
      if (a.language !== primaryLang && b.language === primaryLang) return 1;
      
      return 0;
  });
};

export const getConceptDetails = async (title: string, lang: string = 'en'): Promise<WikiConcept | null> => {
  // Use action=query to get full data: extracts (content), pageimages (HD), info (url, modified), categories
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    prop: 'extracts|pageimages|info|categories',
    titles: title,
    pithumbsize: '1200', // High res
    inprop: 'url|displaytitle',
    origin: '*',
    // Note: Omitting exintro=1 to get full content
  });

  const url = `https://${lang}.wikipedia.org/w/api.php?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const data = await response.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (pageId === '-1') return null; // Page not found

    // Clean up categories
    const categories = page.categories 
      ? page.categories.map((c: any) => c.title.replace(/^Category:/, '')).filter((c: string) => !c.includes('articles'))
      : [];

    // The extract field contains HTML because we didn't specify explaintext
    const rawHtml = page.extract || '';
    
    // Generate AI metadata
    const insights = await generateInsights(rawHtml);
    const reflection = await generateReflection(page.title, rawHtml);

    return {
      id: page.pageid ? page.pageid.toString() : title.replace(/\s+/g, '_'),
      title: page.title,
      extract: rawHtml.substring(0, 200).replace(/<[^>]*>?/gm, '') + '...', // Just a fallback plain text summary
      content: rawHtml, // Full HTML
      url: page.fullurl,
      imageUrl: page.thumbnail?.source,
      language: lang, // Vital for tracking source
      metadata: {
        keywords: [page.title],
        categories: categories.slice(0, 5), // Limit to 5 relevant ones
      },
      insights,
      reflection,
      createdAt: new Date().toISOString(),
      lastModified: page.touched
    };
  } catch (error) {
    console.error("Wiki detail error:", error);
    return null;
  }
};
