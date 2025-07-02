import { Product } from '../core/models/product.model';

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    description: 'A comfortable and versatile white t-shirt made from 100% cotton.',
    price: 29.99,
    category: 'Clothing',
    subCategory: 'T-Shirts',
    brand: 'Basic',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    images: ['assets/images/products/white-tshirt.jpg'],
    rating: 4.5,
    reviews: 25,
    inStock: true
  },
  {
    id: 2,
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans with a comfortable stretch.',
    price: 79.99,
    category: 'Clothing',
    subCategory: 'Jeans',
    brand: 'DenimCo',
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black'],
    images: ['assets/images/products/slim-jeans.jpg'],
    rating: 4.2,
    reviews: 18,
    inStock: true
  },
  {
    id: 3,
    name: 'Summer Dress',
    description: 'Light and flowy summer dress perfect for warm days.',
    price: 89.99,
    category: 'Clothing',
    subCategory: 'Dresses',
    brand: 'SummerStyle',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral', 'Blue', 'Pink'],
    images: ['assets/images/products/summer-dress.jpg'],
    rating: 4.8,
    reviews: 42,
    inStock: true
  }
]; 