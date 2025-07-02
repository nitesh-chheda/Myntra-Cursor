import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
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
          <img mat-card-image [src]="product.images[0]" [alt]="product.name">
          <mat-card-content>
            <h3>{{product.name}}</h3>
            <p>{{product.brand}}</p>
            <p class="price">{{ product.price }}</p>
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
    </div>
  `,
  styles: [`
    .product-list-container {
      padding: 20px;
    }

    .filters-section {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  brands: string[] = [];
  selectedCategory = '';
  selectedBrand = '';
  selectedPriceRange = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
      this.categories = [...new Set(products.map(p => p.category))];
      this.brands = [...new Set(products.map(p => p.brand))];
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

  private filterByPriceRange(price: number): boolean {
    if (!this.selectedPriceRange) return true;
    
    const [min, max] = this.selectedPriceRange.split('-').map(Number);
    if (max) {
      return price >= min && price <= max;
    } else {
      return price >= min;
    }
  }
} 