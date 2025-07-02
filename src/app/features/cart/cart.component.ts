import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>

      <div class="cart-content" *ngIf="cartItems.length > 0; else emptyCart">
        <div class="cart-items">
          <mat-card *ngFor="let item of cartItems" class="cart-item">
            <div class="item-image">
              <img [src]="item.product.images[0]" [alt]="item.product.name">
            </div>
            
            <div class="item-details">
              <h3>{{item.product.name}}</h3>
              <p class="brand">{{item.product.brand}}</p>
              <p>Size: {{item.size}}</p>
              <p>Color: {{item.color}}</p>
              <p class="price">{{ item.product.price }}</p>
            </div>

            <div class="item-quantity">
              <button mat-icon-button (click)="updateQuantity(item, item.quantity - 1)" [disabled]="item.quantity <= 1">
                <mat-icon>remove</mat-icon>
              </button>
              <span>{{item.quantity}}</span>
              <button mat-icon-button (click)="updateQuantity(item, item.quantity + 1)">
                <mat-icon>add</mat-icon>
              </button>
            </div>

            <div class="item-total">
              {{ item.product.price * item.quantity | number:'1.2-2' }}
            </div>

            <button mat-icon-button color="warn" (click)="removeItem(item)">
              <mat-icon>delete</mat-icon>
            </button>
          </mat-card>
        </div>

        <div class="cart-summary">
          <mat-card>
            <mat-card-content>
              <h2>Order Summary</h2>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ cartTotal | number:'1.2-2' }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>{{ cartTotal | number:'1.2-2' }}</span>
              </div>
              <button mat-raised-button color="primary" routerLink="/checkout">
                Proceed to Checkout
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="empty-cart">
          <mat-icon>shopping_cart</mat-icon>
          <h2>Your cart is empty</h2>
          <p>Add items to your cart to start shopping</p>
          <button mat-raised-button color="primary" routerLink="/products">
            Continue Shopping
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-container {
      padding: 20px;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr auto auto auto;
      gap: 20px;
      align-items: center;
      padding: 20px;
      margin-bottom: 20px;
    }

    .item-image img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .brand {
      color: #666;
    }

    .price {
      font-weight: bold;
      color: #2196f3;
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .item-total {
      font-weight: bold;
      font-size: 1.2em;
    }

    .cart-summary {
      position: sticky;
      top: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
    }

    .summary-row.total {
      font-weight: bold;
      font-size: 1.2em;
      border-top: 1px solid #eee;
      padding-top: 10px;
      margin-top: 10px;
    }

    .empty-cart {
      text-align: center;
      padding: 40px;
    }

    .empty-cart mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }

    button[mat-raised-button] {
      width: 100%;
      margin-top: 20px;
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartTotal = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });

    this.cartService.getCartTotal().subscribe(total => {
      this.cartTotal = total;
    });
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(item, quantity);
    }
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }
} 