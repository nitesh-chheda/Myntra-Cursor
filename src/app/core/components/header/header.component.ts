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
    <mat-toolbar color="primary" class="myntra-toolbar">
      <a routerLink="/" class="logo">
        <img src="assets/myntra-logo.svg" alt="Myntra" height="36" style="vertical-align: middle;"/>
      </a>
      <nav class="category-nav">
        <a mat-button routerLink="/men">Men</a>
        <a mat-button routerLink="/women">Women</a>
        <a mat-button routerLink="/kids">Kids</a>
        <a mat-button routerLink="/home-living">Home & Living</a>
        <a mat-button routerLink="/beauty">Beauty</a>
        <a mat-button routerLink="/studio">Studio</a>
      </nav>
      <div class="search-bar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput placeholder="Search for products, brands and more" />
        </mat-form-field>
      </div>
      <div class="spacer"></div>
      <div class="user-actions">
        <a mat-icon-button routerLink="/wishlist" matTooltip="Wishlist">
          <mat-icon [matBadge]="wishlistItemCount > 0 ? wishlistItemCount : null" matBadgeColor="warn">favorite_border</mat-icon>
        </a>
        <a mat-icon-button routerLink="/cart" matTooltip="Cart">
          <mat-icon [matBadge]="cartItemCount > 0 ? cartItemCount : null" matBadgeColor="warn">shopping_bag</mat-icon>
        </a>
        <ng-container *ngIf="currentUser; else authButtons">
          <button mat-icon-button [matMenuTriggerFor]="userMenu" matTooltip="Account">
            <mat-icon>person</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item routerLink="/orders">
              <mat-icon>shopping_bag</mat-icon>
              <span>Orders</span>
            </button>
            <button mat-menu-item *ngIf="isAdmin" routerLink="/admin">
              <mat-icon>admin_panel_settings</mat-icon>
              <span>Admin</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </ng-container>
        <ng-template #authButtons>
          <a mat-button routerLink="/auth/login">Login</a>
          <a mat-raised-button color="accent" routerLink="/auth/register">Register</a>
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

  logout() {
    this.authService.logout();
  }
} 