/** One curated Amazon product shown in the homepage grid and the AI advisor seed. */
export interface Product {
  asin: string;
  title: string;
  imageUrl: string | null;
  price: string | null;        // formatted, e.g. "$129.00"
  currency: string | null;
  features: string[];
  tags: string[];
  category: string;            // site category slug
  priceValue: number | null;   // numeric USD price
}
