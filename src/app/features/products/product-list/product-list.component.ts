import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService, CartItem } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    RouterModule
  ],
  template: `
    <div class="product-list-container">
      <div class="filters-section">
        <mat-form-field>
          <mat-label>Category</mat-label>
          <mat-select [(ngModel)]="selectedCategory" (selectionChange)="applyFilters()">
            <mat-option value="">All Categories</mat-option>
            <mat-option *ngFor="let category of categories" [value]="category">
              {{category}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Brand</mat-label>
          <mat-select [(ngModel)]="selectedBrand" (selectionChange)="applyFilters()">
            <mat-option value="">All Brands</mat-option>
            <mat-option *ngFor="let brand of brands" [value]="brand">
              {{brand}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Price Range</mat-label>
          <mat-select [(ngModel)]="selectedPriceRange" (selectionChange)="applyFilters()">
            <mat-option value="">All Prices</mat-option>
            <mat-option value="0-50">$0 - $50</mat-option>
            <mat-option value="50-100">$50 - $100</mat-option>
            <mat-option value="100+">$100+</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="products-grid">
        <mat-card *ngFor="let product of filteredProducts" class="product-card">
          <div class="product-image-container">
            <img mat-card-image [src]="product.images[0]" [alt]="product.name" (error)="handleImageError($event)">
            <button mat-icon-button class="wishlist-btn" (click)="toggleWishlist(product)" 
                    [class.in-wishlist]="isInWishlist(product.id)" 
                    matTooltip="{{isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}}">
              <mat-icon>{{isInWishlist(product.id) ? 'favorite' : 'favorite_border'}}</mat-icon>
            </button>
          </div>
          <mat-card-content>
            <h3 class="product-name">{{product.name}}</h3>
            <p class="brand">{{product.brand}}</p>
            <p class="price">&#8377;{{product.price | number:'1.2-2'}}</p>
            <div class="rating" *ngIf="product.rating">
              <mat-icon class="star">star</mat-icon>
              <span>{{product.rating}} ({{product.reviews}})</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" [routerLink]="['/products', product.id]">
              View Details
            </button>
            <button mat-raised-button color="accent" (click)="addToCart(product)">
              Add to Cart
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .product-list-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
      background-color: #f8f8f8;
      min-height: calc(100vh - 128px);
    }

    .filters-section {
      display: flex;
      gap: 20px;
      margin-bottom: 24px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .product-card {
      display: flex;
      flex-direction: column;
      transition: box-shadow 0.3s ease;
      cursor: pointer;
    }

    .product-card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }

    .product-image-container {
      position: relative;
      overflow: hidden;
    }

    .product-image-container img {
      height: 200px;
      width: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-image-container:hover img {
      transform: scale(1.05);
    }

    .wishlist-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(255, 255, 255, 0.9);
      color: #696b79;
      transition: all 0.3s ease;
    }

    .wishlist-btn:hover {
      background: white;
      color: #ff3f6c;
    }

    .wishlist-btn.in-wishlist {
      color: #ff3f6c;
      background: white;
    }

    .product-name {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: #282c3f;
      line-height: 1.3;
    }

    .brand {
      margin: 0 0 8px 0;
      color: #696b79;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .price {
      margin: 0 0 8px 0;
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

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      gap: 8px;
    }

    mat-card-actions button {
      flex: 1;
    }

    button[mat-raised-button] {
      background-color: #ff3f6c;
      color: white;
    }

    button[mat-raised-button]:hover {
      background-color: #e0365c;
    }

    @media (max-width: 768px) {
      .filters-section {
        flex-direction: column;
        gap: 16px;
      }
      
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 16px;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  brands: string[] = [];
  selectedCategory = '';
  selectedBrand = '';
  selectedPriceRange = '';
  wishlistItems: Product[] = [];

  constructor(
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadWishlist();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      this.categories = [...new Set(products.map(p => p.category))];
      this.brands = [...new Set(products.map(p => p.brand))];
    });
  }

  loadWishlist() {
    this.wishlistService.getWishlistItems().subscribe(items => {
      this.wishlistItems = items;
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const categoryMatch = !this.selectedCategory || product.category === this.selectedCategory;
      const brandMatch = !this.selectedBrand || product.brand === this.selectedBrand;
      const priceMatch = this.filterByPriceRange(product.price);
      return categoryMatch && brandMatch && priceMatch;
    });
  }

  filterByPriceRange(price: number): boolean {
    if (!this.selectedPriceRange) return true;
    
    switch(this.selectedPriceRange) {
      case '0-50':
        return price <= 50;
      case '50-100':
        return price > 50 && price <= 100;
      case '100+':
        return price > 100;
      default:
        return true;
    }
  }

  toggleWishlist(product: Product) {
    this.wishlistService.toggleWishlist(product);
    const isNowInWishlist = !this.isInWishlist(product.id);
    const message = isNowInWishlist 
      ? `${product.name} added to wishlist` 
      : `${product.name} removed from wishlist`;
    
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistItems.some(item => item.id === productId);
  }

  addToCart(product: Product) {
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

  handleImageError(event: any) {
    event.target.src = 'assets/images/placeholder-product.jpg';
  }
} 