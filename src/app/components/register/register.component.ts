

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  // simple email validation function using regex
  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  onSubmit(): void {
    // check all fields filled
    if (!this.email || !this.password || !this.firstName || !this.lastName) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    // check valid email
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // register user
    if (this.authService.register({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      role: 'user'
    })) {
      this.errorMessage = '';
      this.successMessage = 'Registration successful! Redirecting to login...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.errorMessage = 'User already exists with this email';
    }
  }
}

