export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  brand: string;
  sizes: string[];
  colors: string[];
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
} 