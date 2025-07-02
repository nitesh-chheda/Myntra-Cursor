import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { products } from '../../data/products';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems: Product[] = [];

  constructor() {}

  getWishlistItems(): Observable<Product[]> {
    return of(this.wishlistItems);
  }

  addToWishlist(product: Product): Observable<Product[]> {
    if (!this.wishlistItems.find(item => item.id === product.id)) {
      this.wishlistItems.push(product);
    }
    return of(this.wishlistItems);
  }

  removeFromWishlist(productId: number): Observable<Product[]> {
    this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId);
    return of(this.wishlistItems);
  }

  isInWishlist(productId: number): Observable<boolean> {
    return of(this.wishlistItems.some(item => item.id === productId));
  }
} 