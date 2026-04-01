import categoriesJson from './defaultCategoriesData.json';

export const DEFAULT_CATEGORIES: Record<string, Record<string, string[]>> = categoriesJson;

export function getDefaultCategoriesForBusinessType(type: string): Record<string, string[]> {
  if (DEFAULT_CATEGORIES[type]) {
    return DEFAULT_CATEGORIES[type];
  }
  // Fallback fuzz matching
  const key = Object.keys(DEFAULT_CATEGORIES).find(k => k.toLowerCase().includes(type.toLowerCase()) || type.toLowerCase().includes(k.toLowerCase()));
  return key ? DEFAULT_CATEGORIES[key] : {
    "General Items": ["Uncategorized", "General Merchandise"],
    "Miscellaneous": ["Miscellaneous Item 1", "Miscellaneous Item 2"]
  };
}
