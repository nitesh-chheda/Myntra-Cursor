import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from 'crypto-js';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly USERS_API = 'assets/data/users.json';
  private readonly AUTH_TOKEN_KEY = 'auth_tokens';
  private readonly ENCRYPTION_KEY = 'myntra_secure_key_2024';
  private jwtHelper = new JwtHelperService();
  private refreshTokenTimer: any;

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth() {
    const tokenData = this.getStoredTokens();
    if (tokenData && !this.isTokenExpired(tokenData.access_token)) {
      const user = this.getUserFromToken(tokenData.access_token);
      this.currentUserSubject.next(user);
      this.scheduleTokenRefresh(tokenData.expires_at);
    } else if (tokenData && tokenData.refresh_token) {
      this.refreshAccessToken().subscribe({
        next: () => {},
        error: () => {
          this.clearStoredTokens();
        }
      });
    }
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
  }

  private decryptData(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private storeTokens(tokenData: TokenData): void {
    const encryptedData = this.encryptData(JSON.stringify(tokenData));
    localStorage.setItem(this.AUTH_TOKEN_KEY, encryptedData);
  }

  private getStoredTokens(): TokenData | null {
    try {
      const encryptedData = localStorage.getItem(this.AUTH_TOKEN_KEY);
      if (!encryptedData) return null;
      const decryptedData = this.decryptData(encryptedData);
      return JSON.parse(decryptedData);
    } catch {
      return null;
    }
  }

  private clearStoredTokens(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
    }
  }

  private isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }

  private getUserFromToken(token: string): User | null {
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return {
        id: decodedToken.sub,
        email: decodedToken.email,
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
        role: decodedToken.role
      };
    } catch {
      return null;
    }
  }

  private scheduleTokenRefresh(expiresAt: number): void {
    const refreshTime = expiresAt - Date.now() - 60000;
    if (refreshTime > 0) {
      this.refreshTokenTimer = setTimeout(() => {
        this.refreshAccessToken().subscribe();
      }, refreshTime);
    }
  }

  private generateMockJWT(user: User): string {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    const payload = {
      sub: user.id,
      email: user.email,
      given_name: user.firstName,
      family_name: user.lastName,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const signature = btoa('mock_signature');
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUserSubject.pipe(
      map(user => !!user)
    );
  }

  getAccessToken(): string | null {
    const tokenData = this.getStoredTokens();
    if (tokenData && !this.isTokenExpired(tokenData.access_token)) {
      return tokenData.access_token;
    }
    return null;
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    if (!credentials.email || !credentials.password) {
      return throwError(() => new Error('Email and password are required'));
    }
    if (!this.isValidEmail(credentials.email)) {
      return throwError(() => new Error('Please enter a valid email address'));
    }
    return timer(500).pipe(
      switchMap(() => {
        const mockUsers = [
          {
            id: 1,
            email: 'user@example.com',
            password: 'hashedPassword123',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user'
          },
          {
            id: 2,
            email: 'admin@example.com',
            password: 'hashedPassword456',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
          }
        ];
        const user = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        );
        if (!user) {
          throw new Error('Invalid credentials');
        }
        const { password, ...userWithoutPassword } = user;
        const access_token = this.generateMockJWT(userWithoutPassword);
        const refresh_token = this.generateMockJWT(userWithoutPassword);
        return {
          user: userWithoutPassword,
          access_token,
          refresh_token,
          expires_in: 3600
        };
      }),
      tap(authResponse => {
        const tokenData: TokenData = {
          access_token: authResponse.access_token,
          refresh_token: authResponse.refresh_token,
          expires_at: Date.now() + (authResponse.expires_in * 1000)
        };
        this.storeTokens(tokenData);
        this.currentUserSubject.next(authResponse.user);
        this.scheduleTokenRefresh(tokenData.expires_at);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return throwError(() => new Error('All fields are required'));
    }
    if (!this.isValidEmail(data.email)) {
      return throwError(() => new Error('Please enter a valid email address'));
    }
    if (data.password.length < 8) {
      return throwError(() => new Error('Password must be at least 8 characters long'));
    }
    if (!this.isValidPassword(data.password)) {
      return throwError(() => new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number'));
    }
    return timer(500).pipe(
      switchMap(() => {
        const mockUsers = [
          {
            id: 1,
            email: 'user@example.com',
            password: 'hashedPassword123',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user'
          },
          {
            id: 2,
            email: 'admin@example.com',
            password: 'hashedPassword456',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin'
          }
        ];
        const existingUser = mockUsers.find(u => u.email === data.email);
        if (existingUser) {
          throw new Error('Email already exists');
        }
        const newUser = {
          id: mockUsers.length + 1,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'user'
        };
        const access_token = this.generateMockJWT(newUser);
        const refresh_token = this.generateMockJWT(newUser);
        return {
          user: newUser,
          access_token,
          refresh_token,
          expires_in: 3600
        };
      }),
      tap(authResponse => {
        const tokenData: TokenData = {
          access_token: authResponse.access_token,
          refresh_token: authResponse.refresh_token,
          expires_at: Date.now() + (authResponse.expires_in * 1000)
        };
        this.storeTokens(tokenData);
        this.currentUserSubject.next(authResponse.user);
        this.scheduleTokenRefresh(tokenData.expires_at);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return throwError(() => error);
      })
    );
  }

  refreshAccessToken(): Observable<AuthResponse> {
    const tokenData = this.getStoredTokens();
    if (!tokenData?.refresh_token) {
      return throwError(() => new Error('No refresh token available'));
    }
    return timer(100).pipe(
      switchMap(() => {
        const user = this.getUserFromToken(tokenData.refresh_token);
        if (!user) {
          throw new Error('Invalid refresh token');
        }
        const access_token = this.generateMockJWT(user);
        const refresh_token = this.generateMockJWT(user);
        return {
          user,
          access_token,
          refresh_token,
          expires_in: 3600
        };
      }),
      tap(authResponse => {
        const newTokenData: TokenData = {
          access_token: authResponse.access_token,
          refresh_token: authResponse.refresh_token,
          expires_at: Date.now() + (authResponse.expires_in * 1000)
        };
        this.storeTokens(newTokenData);
        this.currentUserSubject.next(authResponse.user);
        this.scheduleTokenRefresh(newTokenData.expires_at);
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearStoredTokens();
    this.currentUserSubject.next(null);
  }

  isAdmin(): Observable<boolean> {
    return this.currentUserSubject.pipe(
      map(user => user?.role === 'admin')
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return timer(1000).pipe(
      switchMap(() => {
        return { next: true };
      }),
      map(() => true),
      catchError(error => {
        console.error('Password change error:', error);
        return throwError(() => error);
      })
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    return passwordRegex.test(password);
  }
}