import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService, CartItem } from '../../core/services/cart.service';
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
      <div class="wishlist-header">
        <h1>My Wishlist</h1>
        <p class="subtitle" *ngIf="wishlistItems.length > 0">{{wishlistItems.length}} item{{wishlistItems.length !== 1 ? 's' : ''}}</p>
      </div>

      <div class="wishlist-content" *ngIf="wishlistItems.length > 0; else emptyWishlist">
        <mat-card *ngFor="let item of wishlistItems" class="wishlist-item">
          <div class="item-image">
            <img [src]="item.images[0]" [alt]="item.name" (error)="handleImageError($event)">
          </div>
          
          <div class="item-details">
            <h3 class="item-name">{{item.name}}</h3>
            <p class="brand">{{item.brand}}</p>
            <p class="price">&#8377;{{item.price | number:'1.2-2'}}</p>
            <div class="rating" *ngIf="item.rating">
              <mat-icon class="star">star</mat-icon>
              <span>{{item.rating}} ({{item.reviews}} reviews)</span>
            </div>
          </div>

          <div class="item-actions">
            <button mat-raised-button color="primary" (click)="addToCart(item)">
              Add to Cart
            </button>
            <button mat-icon-button color="warn" (click)="removeFromWishlist(item)" matTooltip="Remove from wishlist">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </mat-card>
      </div>

      <ng-template #emptyWishlist>
        <div class="empty-wishlist">
          <mat-icon class="empty-icon">favorite_border</mat-icon>
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      background-color: #f8f8f8;
      min-height: calc(100vh - 128px);
    }

    .wishlist-header {
      background: white;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .wishlist-header h1 {
      margin: 0 0 8px 0;
      color: #282c3f;
      font-size: 24px;
      font-weight: 600;
    }

    .subtitle {
      margin: 0;
      color: #696b79;
      font-size: 14px;
    }

    .wishlist-content {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .wishlist-item {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
      transition: box-shadow 0.3s ease;
      cursor: pointer;
    }

    .wishlist-item:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .item-image {
      position: relative;
      height: 200px;
      overflow: hidden;
      border-radius: 4px;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .item-image:hover img {
      transform: scale(1.05);
    }

    .item-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .item-name {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #282c3f;
      line-height: 1.3;
    }

    .brand {
      margin: 0;
      color: #696b79;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .price {
      margin: 0;
      font-weight: 700;
      color: #ff3f6c;
      font-size: 16px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #696b79;
    }

    .rating .star {
      font-size: 14px;
      color: #ff905a;
    }

    .item-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-top: auto;
    }

    .item-actions button[mat-raised-button] {
      flex: 1;
      background-color: #ff3f6c;
      color: white;
    }

    .item-actions button[mat-raised-button]:hover {
      background-color: #e0365c;
    }

    .empty-wishlist {
      text-align: center;
      padding: 80px 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .empty-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #d4d5d9;
      margin-bottom: 16px;
    }

    .empty-wishlist h2 {
      color: #282c3f;
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
    }

    .empty-wishlist p {
      color: #696b79;
      margin: 0 0 24px 0;
      font-size: 14px;
    }

    .empty-wishlist button {
      background-color: #ff3f6c;
      color: white;
    }

    .empty-wishlist button:hover {
      background-color: #e0365c;
    }

    @media (max-width: 768px) {
      .wishlist-container {
        padding: 16px;
      }
      
      .wishlist-content {
        grid-template-columns: 1fr;
      }
      
      .empty-wishlist {
        padding: 60px 20px;
      }
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.wishlistService.getWishlistItems().subscribe(items => {
      this.wishlistItems = items;
    });
  }

  addToCart(product: Product) {
    // Default cart item with first available size and color
    const cartItem: CartItem = {
      product: product,
      quantity: 1,
      size: product.sizes[0] || 'M',
      color: product.colors[0] || 'Default'
    };
    
    this.cartService.addToCart(cartItem);
    this.snackBar.open(`${product.name} added to cart`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  removeFromWishlist(product: Product) {
    this.wishlistService.removeFromWishlist(product.id);
    this.snackBar.open(`${product.name} removed from wishlist`, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/placeholder-product.jpg';
  }
} 