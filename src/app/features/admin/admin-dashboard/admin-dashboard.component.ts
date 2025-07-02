import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div class="dashboard-grid">
        <mat-card>
          <mat-card-content>
            <h2>Total Products</h2>
            <p class="number">0</p>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-content>
            <h2>Total Orders</h2>
            <p class="number">0</p>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-content>
            <h2>Total Users</h2>
            <p class="number">0</p>
          </mat-card-content>
        </mat-card>
        <mat-card>
          <mat-card-content>
            <h2>Total Revenue</h2>
            <p class="number">$0.00</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .number {
      font-size: 2em;
      font-weight: bold;
      color: #2196f3;
      margin: 10px 0;
    }
  `]
})
export class AdminDashboardComponent {} 