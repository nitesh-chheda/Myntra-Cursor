import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, User } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User as UserModel, Address } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>My Profile</mat-card-title>
          <mat-card-subtitle>Manage your account information</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <mat-tab-group>
            <!-- Profile Information Tab -->
            <mat-tab label="Profile Information">
              <div class="tab-content">
                <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Full Name</mat-label>
                    <input matInput formControlName="name" placeholder="Enter your full name">
                    <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
                      Name is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput formControlName="email" type="email" placeholder="Enter your email">
                    <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                      Email is required
                    </mat-error>
                    <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                      Please enter a valid email
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Phone Number</mat-label>
                    <input matInput formControlName="phone" placeholder="Enter your phone number">
                  </mat-form-field>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="profileForm.invalid || isLoading">
                      {{ isLoading ? 'Updating...' : 'Update Profile' }}
                    </button>
                  </div>
                </form>
              </div>
            </mat-tab>

            <!-- Address Information Tab -->
            <mat-tab label="Address">
              <div class="tab-content">
                <form [formGroup]="addressForm" (ngSubmit)="updateAddress()">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Street Address</mat-label>
                    <input matInput formControlName="street" placeholder="Enter your street address">
                    <mat-error *ngIf="addressForm.get('street')?.hasError('required')">
                      Street address is required
                    </mat-error>
                  </mat-form-field>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>City</mat-label>
                      <input matInput formControlName="city" placeholder="Enter your city">
                      <mat-error *ngIf="addressForm.get('city')?.hasError('required')">
                        City is required
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>State</mat-label>
                      <input matInput formControlName="state" placeholder="Enter your state">
                      <mat-error *ngIf="addressForm.get('state')?.hasError('required')">
                        State is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-row">
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>ZIP Code</mat-label>
                      <input matInput formControlName="zipCode" placeholder="Enter your ZIP code">
                      <mat-error *ngIf="addressForm.get('zipCode')?.hasError('required')">
                        ZIP code is required
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Country</mat-label>
                      <input matInput formControlName="country" placeholder="Enter your country">
                      <mat-error *ngIf="addressForm.get('country')?.hasError('required')">
                        Country is required
                      </mat-error>
                    </mat-form-field>
                  </div>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="addressForm.invalid || isLoading">
                      {{ isLoading ? 'Updating...' : 'Update Address' }}
                    </button>
                  </div>
                </form>
              </div>
            </mat-tab>

            <!-- Change Password Tab -->
            <mat-tab label="Change Password">
              <div class="tab-content">
                <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Current Password</mat-label>
                    <input matInput type="password" formControlName="currentPassword" 
                           placeholder="Enter your current password">
                    <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                      Current password is required
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>New Password</mat-label>
                    <input matInput type="password" formControlName="newPassword" 
                           placeholder="Enter your new password">
                    <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                      New password is required
                    </mat-error>
                    <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                      Password must be at least 6 characters long
                    </mat-error>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Confirm New Password</mat-label>
                    <input matInput type="password" formControlName="confirmPassword" 
                           placeholder="Confirm your new password">
                    <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                      Please confirm your password
                    </mat-error>
                    <mat-error *ngIf="passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched">
                      Passwords do not match
                    </mat-error>
                  </mat-form-field>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit" 
                            [disabled]="passwordForm.invalid || isLoading">
                      {{ isLoading ? 'Changing...' : 'Change Password' }}
                    </button>
                  </div>
                </form>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 32px auto;
      padding: 0 16px;
    }

    .profile-card {
      margin-bottom: 24px;
    }

    .tab-content {
      padding: 24px 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      width: 100%;
    }

    .half-width {
      flex: 1;
      margin-bottom: 16px;
    }

    .form-actions {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;
    }

    mat-card-header {
      margin-bottom: 16px;
    }

    .mat-mdc-tab-body-content {
      overflow: visible !important;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  addressForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.createProfileForm();
    this.addressForm = this.createAddressForm();
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserData(user.id);
      }
    });
  }

  private createProfileForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  private createAddressForm(): FormGroup {
    return this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  private createPasswordForm(): FormGroup {
    const form = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    // Add custom validator for password confirmation
    form.setValidators(this.passwordMatchValidator);
    return form;
  }

  private passwordMatchValidator(control: any) {
    const form = control as FormGroup;
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private loadUserData(userId: number) {
    this.userService.getUserById(userId).subscribe(user => {
      if (user) {
        // Update profile form - map from UserModel to auth User format
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        });

        // Update address form
        if (user.address) {
          this.addressForm.patchValue(user.address);
        }
      }
    });
  }

  updateProfile() {
    if (this.profileForm.valid && this.currentUser) {
      this.isLoading = true;
      const profileData = this.profileForm.value;
      
      this.userService.updateUser(this.currentUser.id, profileData).subscribe({
        next: (updatedUser) => {
          this.isLoading = false;
          this.snackBar.open('Profile updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to update profile. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  updateAddress() {
    if (this.addressForm.valid && this.currentUser) {
      this.isLoading = true;
      const addressData = { address: this.addressForm.value };
      
      this.userService.updateUser(this.currentUser.id, addressData).subscribe({
        next: (updatedUser) => {
          this.isLoading = false;
          this.snackBar.open('Address updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to update address. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  changePassword() {
    if (this.passwordForm.valid && this.currentUser) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;
      
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: (success) => {
          this.isLoading = false;
          if (success) {
            this.passwordForm.reset();
            this.snackBar.open('Password changed successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          } else {
            this.snackBar.open('Failed to change password. Please check your current password.', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Failed to change password. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}