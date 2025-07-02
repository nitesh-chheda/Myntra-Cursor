import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="wishlist-container">
      <h1>My Wishlist</h1>

      <div class="wishlist-content" *ngIf="wishlistItems.length > 0; else emptyWishlist">
        <mat-card *ngFor="let item of wishlistItems" class="wishlist-item">
          <div class="item-image">
            <img [src]="item.product.images[0]" [alt]="item.product.name">
          </div>
          
          <div class="item-details">
            <h3>{{item.product.name}}</h3>
            <p class="brand">{{item.product.brand}}</p>
            <p class="price">{{item.product.price}}</p>
          </div>

          <div class="item-actions">
            <button mat-raised-button color="primary" (click)="addToCart(item)">
              Add to Cart
            </button>
            <button mat-icon-button color="warn" (click)="removeFromWishlist(item)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </mat-card>
      </div>

      <ng-template #emptyWishlist>
        <div class="empty-wishlist">
          <mat-icon>favorite_border</mat-icon>
          <h2>Your wishlist is empty</h2>
          <p>Add items to your wishlist to save them for later</p>
          <button mat-raised-button color="primary" routerLink="/products">
            Continue Shopping
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .wishlist-container {
      padding: 20px;
    }

    .wishlist-content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .wishlist-item {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    .item-image img {
      width: 100%;
      height: 200px;
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

    .item-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .empty-wishlist {
      text-align: center;
      padding: 40px;
    }

    .empty-wishlist mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }

    button[mat-raised-button] {
      margin-top: 20px;
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = []; // TODO: Create proper interface for wishlist items

  constructor(private wishlistService: WishlistService) {}

  ngOnInit() {
    // TODO: Implement wishlist service and load items
  }

  addToCart(item: any) {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', item);
  }

  removeFromWishlist(item: any) {
    // TODO: Implement remove from wishlist functionality
    console.log('Removing from wishlist:', item);
  }
} 