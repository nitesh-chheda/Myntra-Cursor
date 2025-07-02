import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { users } from '../../data/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor() {}

  getUsers(): Observable<User[]> {
    return of(users);
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(users.find(user => user.id === id));
  }

  updateUser(id: number, userData: Partial<User>): Observable<User | undefined> {
    const user = users.find(user => user.id === id);
    if (user) {
      Object.assign(user, userData);
    }
    return of(user);
  }

  createUser(userData: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map(u => u.id)) + 1
    };
    users.push(newUser);
    return of(newUser);
  }

  deleteUser(id: number): Observable<boolean> {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
} 