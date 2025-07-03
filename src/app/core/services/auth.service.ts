import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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
    try {
      const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
      if (token) {
        this.currentUserSubject.next(JSON.parse(token));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
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
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.email === data.email);
        if (existingUser) {
          observer.error(new Error('Email already exists'));
          return;
        }
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
    try {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
    this.currentUserSubject.next(null);
  }

  isAdmin(): Observable<boolean> {
    return this.currentUserSubject.pipe(
      map(user => user?.role === 'admin')
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 1000);
    });
  }
}