import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private authService: AuthService) {}

  getAllUsers(): User[] {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  updateProfile(userData: { firstName: string; lastName: string }): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      localStorage.setItem('users', JSON.stringify(users));
      
      const updatedCurrentUser = {
        ...currentUser,
        firstName: userData.firstName,
        lastName: userData.lastName
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
      return true;
    }
    return false;
  }

  deleteUser(userId: string): boolean {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    return true;
  }



  // Add this method to your existing UserService class
updateUser(userId: string, userData: { firstName: string; lastName: string; email: string; role: 'admin' | 'user' }): boolean {
  const users = this.getAllUsers();
  
  // Check if email already exists for different user
  const existingUser = users.find(u => u.email === userData.email && u.id !== userId);
  if (existingUser) {
    return false;
  }
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex] = { 
      ...users[userIndex], 
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role
    };
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }
  return false;
}

}
