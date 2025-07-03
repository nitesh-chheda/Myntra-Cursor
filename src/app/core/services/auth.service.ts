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
    try {
      const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
      if (token) {
        // In a real app, you would validate the token and decode user info
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
    // In a real app, this would be a POST request to your backend
    return this.http.get<any>(this.USERS_API).pipe(
      map(response => {
        const user = response.users.find(
          (u: any) => u.email === credentials.email && u.password === credentials.password
        );
        if (!user) {
          throw new Error('Invalid credentials');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      tap(user => {
        try {
          localStorage.setItem(this.AUTH_TOKEN_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Error saving user to storage:', error);
          throw error;
        }
      })
    );
  }

  register(data: RegisterData): Observable<User> {
    // In a real app, this would be a POST request to your backend
    return this.http.get<any>(this.USERS_API).pipe(
      map(response => {
        const existingUser = response.users.find((u: any) => u.email === data.email);
        if (existingUser) {
          throw new Error('Email already exists');
        }
        // Simulate creating a new user
        const newUser = {
          id: response.users.length + 1,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: 'user'
        };
        return newUser;
      }),
      tap(user => {
        try {
          localStorage.setItem(this.AUTH_TOKEN_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Error saving user to storage:', error);
          throw error;
        }
      })
    );
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
} 