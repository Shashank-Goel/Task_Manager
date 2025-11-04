import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User, UserProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  register(userData: Omit<User, 'id' | 'createdAt'>): boolean {
    const users = this.getUsers();
    
    if (users.find(u => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const userProfile: UserProfile = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
      localStorage.setItem('currentUser', JSON.stringify(userProfile));
      localStorage.setItem('userRole', user.role);
      this.currentUserSubject.next(userProfile);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  getCurrentUser(): UserProfile | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  private getUsers(): User[] {
    const users = localStorage.getItem('users');
    if (!users) {
      const defaultUsers: User[] = [{
        id: 'admin-1',
        email: 'admin@taskmanager.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date()
      }];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(users);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
