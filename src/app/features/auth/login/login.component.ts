import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { InputValidationService } from '../../../core/utils/input-validation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" autocomplete="off">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input 
                matInput 
                formControlName="email" 
                type="email" 
                placeholder="Enter your email"
                autocomplete="email"
                aria-describedby="email-errors"
                [attr.aria-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <mat-error id="email-errors" *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('invalidEmail')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input 
                matInput 
                formControlName="password" 
                [type]="hidePassword ? 'password' : 'text'"
                autocomplete="current-password"
                aria-describedby="password-errors"
                [attr.aria-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <button 
                mat-icon-button 
                matSuffix 
                (click)="hidePassword = !hidePassword" 
                type="button"
                [attr.aria-label]="hidePassword ? 'Show password' : 'Hide password'"
                aria-describedby="password-visibility">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-error id="password-errors" *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="errorMessage" role="alert" aria-live="polite">
              {{errorMessage}}
            </div>

            <button 
              mat-raised-button 
              color="primary" 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading"
              aria-describedby="login-status">
              <span *ngIf="!isLoading">Login</span>
              <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p>Don't have an account? 
            <a routerLink="/auth/register" aria-label="Navigate to registration page">Register here</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    .error-message {
      color: #f44336;
      margin-bottom: 16px;
    }

    button[type="submit"] {
      width: 100%;
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }

    a {
      color: #2196f3;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, InputValidationService.emailValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Sanitize inputs
      const credentials = {
        email: InputValidationService.validateAndSanitize(this.loginForm.value.email),
        password: this.loginForm.value.password // Don't sanitize password
      };
      
      this.authService.login(credentials).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'An error occurred during login';
        }
      });
    }
  }
} 