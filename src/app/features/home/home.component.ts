import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <div class="home-container">
      <section class="hero-section">
        <mat-card class="hero-card">
          <mat-card-content>
            <h1>Welcome to Fashion Store</h1>
            <p>Discover the latest trends in fashion</p>
            <button mat-raised-button color="primary" routerLink="/products">
              Shop Now
            </button>
          </mat-card-content>
        </mat-card>
      </section>

      <section class="featured-categories">
        <h2>Featured Categories</h2>
        <div class="category-grid">
          <mat-card *ngFor="let category of categories" class="category-card">
            <mat-card-content>
              <h3>{{ category.name }}</h3>
              <button mat-button color="primary" [routerLink]="['/products']" [queryParams]="{category: category.id}">
                View All
              </button>
            </mat-card-content>
          </mat-card>
        </div>
      </section>

      <section class="featured-products">
        <h2>Featured Products</h2>
        <div class="products-grid">
          <mat-card *ngFor="let product of products" class="product-card">
            <img mat-card-image [src]="product.images[0]" [alt]="product.name">
            <mat-card-content>
              <h3>{{product.name}}</h3>
              <p>{{product.brand}}</p>
              <p class="price">{{ product.price | currency }}</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" [routerLink]="['/products', product.id]">
                View Details
              </button>
              <button mat-button color="accent">
                Add to Cart
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
    }

    .hero-section {
      margin-bottom: 40px;
    }

    .hero-card {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      color: #222;
      text-align: center;
      padding: 60px 20px;
    }

    .featured-categories {
      margin-top: 40px;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .category-card {
      text-align: center;
      padding: 20px;
    }

    .featured-products {
      margin-top: 40px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .product-card {
      display: flex;
      flex-direction: column;
    }

    .product-card img {
      height: 200px;
      object-fit: cover;
    }

    .price {
      font-weight: bold;
      color: #2196f3;
    }

    mat-card-actions {
      display: flex;
      justify-content: space-between;
      padding: 8px;
    }
  `]
})
export class HomeComponent implements OnInit {
  categories = [
    { id: 'clothing', name: 'Clothing' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'footwear', name: 'Footwear' },
    { id: 'bags', name: 'Bags' }
  ];
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }
} 