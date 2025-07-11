import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<Product[]>([]);
  private readonly WISHLIST_STORAGE_KEY = 'wishlist_items';

  constructor() {
    this.loadWishlistFromStorage();
  }

  private loadWishlistFromStorage() {
    try {
      const storedWishlist = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
      if (storedWishlist && storedWishlist !== 'null') {
        const parsed = JSON.parse(storedWishlist);
        if (Array.isArray(parsed)) {
          this.wishlistItems.next(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading wishlist from storage:', error);
    }
  }

  private saveWishlistToStorage(items: Product[]) {
    try {
      localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving wishlist to storage:', error);
    }
  }

  getWishlistItems(): Observable<Product[]> {
    return this.wishlistItems.asObservable();
  }

  addToWishlist(product: Product): void {
    const currentItems = this.wishlistItems.value;
    if (!currentItems.find(item => item.id === product.id)) {
      const updatedItems = [...currentItems, product];
      this.wishlistItems.next(updatedItems);
      this.saveWishlistToStorage(updatedItems);
    }
  }

  removeFromWishlist(productId: number): void {
    const currentItems = this.wishlistItems.value;
    const updatedItems = currentItems.filter(item => item.id !== productId);
    this.wishlistItems.next(updatedItems);
    this.saveWishlistToStorage(updatedItems);
  }

  isInWishlist(productId: number): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.wishlistItems.subscribe(items => {
        observer.next(items.some(item => item.id === productId));
      });
    });
  }

  toggleWishlist(product: Product): void {
    const currentItems = this.wishlistItems.value;
    const isInWishlist = currentItems.some(item => item.id === product.id);
    
    if (isInWishlist) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
  }

  getWishlistCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.wishlistItems.subscribe(items => {
        observer.next(items.length);
      });
    });
  }

  clearWishlist(): void {
    this.wishlistItems.next([]);
    this.saveWishlistToStorage([]);
  }
} 