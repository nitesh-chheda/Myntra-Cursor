import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./product-management/product-management.component').then(m => m.ProductManagementComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./order-management/order-management.component').then(m => m.OrderManagementComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
  }
]; 