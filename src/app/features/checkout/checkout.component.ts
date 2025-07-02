import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="checkout-container">
      <h1>Checkout</h1>

      <div class="checkout-content" *ngIf="cartItems.length > 0; else emptyCart">
        <div class="checkout-form">
          <mat-card>
            <mat-card-content>
              <h2>Shipping Information</h2>
              <form>
                <mat-form-field>
                  <mat-label>Full Name</mat-label>
                  <input matInput required>
                </mat-form-field>

                <mat-form-field>
                  <mat-label>Email</mat-label>
                  <input matInput type="email" required>
                </mat-form-field>

                <mat-form-field>
                  <mat-label>Phone</mat-label>
                  <input matInput type="tel" required>
                </mat-form-field>

                <mat-form-field>
                  <mat-label>Address</mat-label>
                  <input matInput required>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field>
                    <mat-label>City</mat-label>
                    <input matInput required>
                  </mat-form-field>

                  <mat-form-field>
                    <mat-label>State</mat-label>
                    <input matInput required>
                  </mat-form-field>

                  <mat-form-field>
                    <mat-label>ZIP Code</mat-label>
                    <input matInput required>
                  </mat-form-field>
                </div>
              </form>
            </mat-card-content>
          </mat-card>

          <mat-card>
            <mat-card-content>
              <h2>Payment Information</h2>
              <form>
                <mat-form-field>
                  <mat-label>Card Number</mat-label>
                  <input matInput required>
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field>
                    <mat-label>Expiry Date</mat-label>
                    <input matInput placeholder="MM/YY" required>
                  </mat-form-field>

                  <mat-form-field>
                    <mat-label>CVV</mat-label>
                    <input matInput type="password" required>
                  </mat-form-field>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="order-summary">
          <mat-card>
            <mat-card-content>
              <h2>Order Summary</h2>
              <div class="summary-row" *ngFor="let item of cartItems">
                <span>{{item.product.name}} x {{item.quantity}}</span>
                <span>{{item.product.price * item.quantity | number:'1.2-2'}}</span>
              </div>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{cartTotal | number:'1.2-2'}}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>{{cartTotal | number:'1.2-2'}}</span>
              </div>
              <button mat-raised-button color="primary" (click)="placeOrder()">
                Place Order
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <ng-template #emptyCart>
        <div class="empty-cart">
          <mat-icon>shopping_cart</mat-icon>
          <h2>Your cart is empty</h2>
          <p>Add items to your cart to proceed with checkout</p>
          <button mat-raised-button color="primary" routerLink="/products">
            Continue Shopping
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .checkout-container {
      padding: 20px;
    }

    .checkout-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
      margin-top: 20px;
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    .order-summary {
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
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
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

  placeOrder() {
    // TODO: Implement order placement functionality
    console.log('Placing order...');
  }
} 