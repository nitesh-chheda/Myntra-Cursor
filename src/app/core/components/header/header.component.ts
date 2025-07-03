import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <mat-toolbar color="primary" class="myntra-toolbar" role="banner">
      <a routerLink="/" class="logo" aria-label="Myntra Home">
        <img src="assets/myntra-logo.svg" alt="Myntra" height="36" style="vertical-align: middle;"/>
      </a>
      <nav class="category-nav" role="navigation" aria-label="Main navigation">
        <a mat-button routerLink="/men" aria-label="Men's clothing">Men</a>
        <a mat-button routerLink="/women" aria-label="Women's clothing">Women</a>
        <a mat-button routerLink="/kids" aria-label="Kids' clothing">Kids</a>
        <a mat-button routerLink="/home-living" aria-label="Home and Living">Home & Living</a>
        <a mat-button routerLink="/beauty" aria-label="Beauty products">Beauty</a>
        <a mat-button routerLink="/studio" aria-label="Studio">Studio</a>
      </nav>
      <div class="search-bar" role="search">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input 
            matInput 
            placeholder="Search for products, brands and more" 
            aria-label="Search for products, brands and more"
            (keyup.enter)="onSearch()"
            [(ngModel)]="searchQuery" />
        </mat-form-field>
      </div>
      <div class="spacer"></div>
      <div class="user-actions" role="navigation" aria-label="User actions">
        <a 
          mat-icon-button 
          routerLink="/wishlist" 
          matTooltip="Wishlist"
          [attr.aria-label]="'View wishlist (' + wishlistItemCount + ' items)'"
          [attr.aria-describedby]="wishlistItemCount > 0 ? 'wishlist-count' : null">
          <mat-icon [matBadge]="wishlistItemCount > 0 ? wishlistItemCount : null" matBadgeColor="warn">favorite_border</mat-icon>
        </a>
        <a 
          mat-icon-button 
          routerLink="/cart" 
          matTooltip="Shopping Cart"
          [attr.aria-label]="'View cart (' + cartItemCount + ' items)'"
          [attr.aria-describedby]="cartItemCount > 0 ? 'cart-count' : null">
          <mat-icon [matBadge]="cartItemCount > 0 ? cartItemCount : null" matBadgeColor="warn">shopping_bag</mat-icon>
        </a>
        <ng-container *ngIf="currentUser; else authButtons">
          <button 
            mat-icon-button 
            [matMenuTriggerFor]="userMenu" 
            matTooltip="Account"
            [attr.aria-label]="'Account menu for ' + (currentUser?.firstName || 'user')"
            aria-haspopup="true">
            <mat-icon>person</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu" role="menu">
            <button mat-menu-item routerLink="/profile" role="menuitem">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item routerLink="/orders" role="menuitem">
              <mat-icon>shopping_bag</mat-icon>
              <span>Orders</span>
            </button>
            <button mat-menu-item *ngIf="isAdmin" routerLink="/admin" role="menuitem">
              <mat-icon>admin_panel_settings</mat-icon>
              <span>Admin</span>
            </button>
            <button mat-menu-item (click)="logout()" role="menuitem">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </ng-container>
        <ng-template #authButtons>
          <a mat-button routerLink="/auth/login" aria-label="Login to your account">Login</a>
          <a mat-button routerLink="/auth/register" aria-label="Create new account">Register</a>
        </ng-template>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .myntra-toolbar {
      display: flex;
      align-items: center;
      background: #fff;
      color: #282c3f;
      box-shadow: 0 2px 4px rgba(40,44,63,.04);
      padding: 0 32px;
    }
    .logo {
      margin-right: 24px;
      display: flex;
      align-items: center;
    }
    .category-nav {
      display: flex;
      gap: 8px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .category-nav a {
      color: #282c3f;
      font-size: 15px;
      letter-spacing: 0.3px;
    }
    .search-bar {
      flex: 1 1 400px;
      max-width: 500px;
      margin: 0 24px;
    }
    .search-field {
      width: 100%;
      background: #f5f5f6;
      border-radius: 4px;
    }
    .spacer {
      flex: 0 0 16px;
    }
    .user-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    a {
      text-decoration: none;
      color: inherit;
    }
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      min-height: 64px;
    }
    
    /* Accessibility improvements */
    .logo:focus,
    .category-nav a:focus,
    .user-actions a:focus,
    .user-actions button:focus {
      outline: 2px solid #ff6b6b;
      outline-offset: 2px;
      border-radius: 4px;
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .myntra-toolbar {
        border-bottom: 2px solid;
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    
    @media (max-width: 900px) {
      .category-nav, .search-bar {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  isAdmin = false;
  cartItemCount = 0;
  wishlistItemCount = 0;
  searchQuery = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });

    this.authService.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    this.cartService.getCartItems().subscribe(items => {
      this.cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });

    this.wishlistService.getWishlistCount().subscribe(count => {
      this.wishlistItemCount = count;
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // Implement search navigation
      console.log('Searching for:', this.searchQuery);
    }
  }

  logout() {
    this.authService.logout();
  }
} 