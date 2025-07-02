import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../core/models/product.model';
import { CartService, CartItem } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule
  ],
  template: `
    <div class="product-detail-container" *ngIf="product">
      <div class="product-images">
        <img [src]="selectedImage" [alt]="product.name" class="main-image">
        <div class="thumbnail-container">
          <img *ngFor="let image of product.images" 
               [src]="image" 
               [alt]="product.name"
               (click)="selectedImage = image"
               class="thumbnail"
               [class.selected]="selectedImage === image">
        </div>
      </div>

      <div class="product-info">
        <h1>{{product.name}}</h1>
        <p class="brand">{{product.brand}}</p>
        <p class="price">{{ product.price }}</p>
        <p class="description">{{product.description}}</p>

        <div class="product-options">
          <mat-form-field>
            <mat-label>Size</mat-label>
            <mat-select [(ngModel)]="selectedSize">
              <mat-option *ngFor="let size of product.sizes" [value]="size">
                {{size}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Color</mat-label>
            <mat-select [(ngModel)]="selectedColor">
              <mat-option *ngFor="let color of product.colors" [value]="color">
                {{color}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="actions">
          <button mat-raised-button color="primary" (click)="addToCart()" [disabled]="!product.inStock">
            Add to Cart
          </button>
          <button mat-raised-button 
                  [color]="isInWishlist ? 'warn' : 'accent'" 
                  (click)="toggleWishlist()"
                  class="wishlist-button">
            <mat-icon>{{isInWishlist ? 'favorite' : 'favorite_border'}}</mat-icon>
            {{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}}
          </button>
        </div>

        <div class="product-meta">
          <p>Rating: {{product.rating}}/5 ({{product.reviews}} reviews)</p>
          <p>Availability: {{product.inStock ? 'In Stock' : 'Out of Stock'}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .product-images {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .main-image {
      width: 100%;
      height: 500px;
      object-fit: cover;
      border-radius: 8px;
    }

    .thumbnail-container {
      display: flex;
      gap: 10px;
      overflow-x: auto;
    }

    .thumbnail {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.3s;
    }

    .thumbnail.selected {
      opacity: 1;
      border: 2px solid #2196f3;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .brand {
      color: #666;
      font-size: 1.2em;
    }

    .price {
      font-size: 1.5em;
      font-weight: bold;
      color: #2196f3;
    }

    .description {
      line-height: 1.6;
    }

    .product-options {
      display: flex;
      gap: 20px;
    }

    .actions {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .actions button {
      flex: 1;
      min-width: 180px;
    }

    .wishlist-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .product-meta {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    @media (max-width: 768px) {
      .product-detail-container {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .actions {
        flex-direction: column;
      }
      
      .actions button {
        min-width: unset;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedImage = '';
  selectedSize = '';
  selectedColor = '';
  isInWishlist = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.productService.getProductById(productId).subscribe(product => {
        if (product) {
          this.product = product;
          this.selectedImage = product.images[0];
          this.selectedSize = product.sizes[0];
          this.selectedColor = product.colors[0];
          this.checkWishlistStatus();
        }
      });
    });
  }

  private checkWishlistStatus() {
    if (this.product) {
      this.wishlistService.isInWishlist(this.product.id).subscribe(inWishlist => {
        this.isInWishlist = inWishlist;
      });
    }
  }

  addToCart() {
    if (this.product) {
      const cartItem: CartItem = {
        product: this.product,
        quantity: 1,
        size: this.selectedSize,
        color: this.selectedColor
      };
      this.cartService.addToCart(cartItem);
      this.snackBar.open(`${this.product.name} added to cart`, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }
  }

  toggleWishlist() {
    if (this.product) {
      this.wishlistService.toggleWishlist(this.product);
      this.isInWishlist = !this.isInWishlist;
      const message = this.isInWishlist 
        ? `${this.product.name} added to wishlist` 
        : `${this.product.name} removed from wishlist`;
      
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }
  }
} 