import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  editMode = false;
  firstName = '';
  lastName = '';
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode && this.user) {
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
    }
    this.errorMessage = '';
    this.successMessage = '';
  }

  updateProfile(): void {
    if (!this.firstName || !this.lastName) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    if (this.userService.updateProfile({
      firstName: this.firstName,
      lastName: this.lastName
    })) {
      this.successMessage = 'Profile updated successfully!';
      this.editMode = false;
      this.loadProfile();
      
      this.authService.currentUser$.subscribe(user => {
        this.user = user;
      });
    } else {
      this.errorMessage = 'Failed to update profile';
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    this.loadProfile();
    this.errorMessage = '';
    this.successMessage = '';
  }
}
