import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private readonly CART_STORAGE_KEY = 'cart_items';

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage() {
    const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (storedCart) {
      this.cartItems.next(JSON.parse(storedCart));
    }
  }

  private saveCartToStorage(items: CartItem[]) {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(item: CartItem) {
    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(
      cartItem => 
        cartItem.product.id === item.product.id &&
        cartItem.size === item.size &&
        cartItem.color === item.color
    );

    if (existingItemIndex > -1) {
      currentItems[existingItemIndex].quantity += item.quantity;
    } else {
      currentItems.push(item);
    }

    this.cartItems.next(currentItems);
    this.saveCartToStorage(currentItems);
  }

  removeFromCart(item: CartItem) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(
      cartItem => 
        !(cartItem.product.id === item.product.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color)
    );

    this.cartItems.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  updateQuantity(item: CartItem, quantity: number) {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(
      cartItem => 
        cartItem.product.id === item.product.id &&
        cartItem.size === item.size &&
        cartItem.color === item.color
    );

    if (itemIndex > -1) {
      currentItems[itemIndex].quantity = quantity;
      this.cartItems.next(currentItems);
      this.saveCartToStorage(currentItems);
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.saveCartToStorage([]);
  }

  getCartTotal(): Observable<number> {
    return new Observable<number>(observer => {
      this.cartItems.subscribe(items => {
        const total = items.reduce(
          (sum, item) => sum + (item.product.price * item.quantity),
          0
        );
        observer.next(total);
      });
    });
  }
} 