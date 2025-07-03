import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly USERS_API = 'assets/data/users.json';
  private readonly AUTH_TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private loadStoredUser() {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    if (token) {
      // In a real app, you would validate the token and decode user info
      this.currentUserSubject.next(JSON.parse(token));
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUserSubject.pipe(
      map(user => !!user)
    );
  }

  login(credentials: LoginCredentials): Observable<User> {
    // Mock users for testing
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

    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        const user = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        );
        if (!user) {
          observer.error(new Error('Invalid credentials'));
          return;
        }
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem(this.AUTH_TOKEN_KEY, JSON.stringify(userWithoutPassword));
        this.currentUserSubject.next(userWithoutPassword);
        observer.next(userWithoutPassword);
        observer.complete();
      }, 500);
    });
  }

  register(data: RegisterData): Observable<User> {
    // Mock users for testing
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

    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.email === data.email);
        if (existingUser) {
          observer.error(new Error('Email already exists'));
          return;
        }
        // Simulate creating a new user
        const newUser = {
          id: mockUsers.length + 1,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'user'
        };
        localStorage.setItem(this.AUTH_TOKEN_KEY, JSON.stringify(newUser));
        this.currentUserSubject.next(newUser);
        observer.next(newUser);
        observer.complete();
      }, 500);
    });
  }

  logout() {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  isAdmin(): Observable<boolean> {
    return this.currentUserSubject.pipe(
      map(user => user?.role === 'admin')
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    // In a real app, this would be a POST request to your backend to change password
    // For now, we'll simulate the password change
    return new Observable(observer => {
      // Simulate API call delay
      setTimeout(() => {
        // In a real app, you would verify the current password and update it
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }
} 