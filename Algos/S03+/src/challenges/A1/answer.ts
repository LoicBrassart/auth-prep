/**
 * In this challenge, you must sort all ads by their price (cheapest first). If some of them
 * have the same price, you should sort by their title alphabetically (A to Z)
 *
 * @param ads Unsorted list of ads
 * @returns Sorted list of ads
 */

// ↓ uncomment bellow lines and add your response!
export default function ({ ads }: { ads: Ad[] }): Ad[] {
  return ads.sort(
    (a, b) => a.price - b.price || a.title.localeCompare(b.title)
  );
  // Implementation plus "naïve" mais ~50x plus rapide
  return ads.sort((a, b) => {
    if (a.price < b.price) return -1;
    if (a.price > b.price) return 1;
    if (a.title < b.title) return -1;
    return 1;
  });
}

// used interfaces, do not touch
export interface Ad {
  title: string;
  price: number;
  tags: string[];
}
