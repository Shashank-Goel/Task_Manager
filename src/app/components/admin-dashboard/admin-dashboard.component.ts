// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { UserService } from '../../services/user.service';
// import { TaskService } from '../../services/task.service';
// import { User } from '../../models/user.model';
// import { Task } from '../../models/task.model';

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.css']
// })
// export class AdminDashboardComponent implements OnInit {
//   users: User[] = [];
//   tasks: Task[] = [];
//   stats = {
//     totalUsers: 0,
//     totalTasks: 0,
//     completedTasks: 0,
//     pendingTasks: 0,
//     highPriorityTasks: 0
//   };

//   constructor(
//     private userService: UserService,
//     private taskService: TaskService
//   ) {}

//   ngOnInit(): void {
//     this.loadData();
//   }

//   loadData(): void {
//     this.users = this.userService.getAllUsers();
//     this.tasks = this.taskService.getAllTasks();
//     this.calculateStats();
//   }

//   calculateStats(): void {
//     this.stats.totalUsers = this.users.filter(u => u.role === 'user').length;
//     this.stats.totalTasks = this.tasks.length;
//     this.stats.completedTasks = this.tasks.filter(t => t.status === 'Completed').length;
//     this.stats.pendingTasks = this.tasks.filter(t => t.status === 'Pending').length;
//     this.stats.highPriorityTasks = this.tasks.filter(t => t.priority === 'High').length;
//   }

//   deleteUser(userId: string): void {
//     if (confirm('Are you sure you want to delete this user? This will also delete all their tasks.')) {
//       const userTasks = this.tasks.filter(t => t.userId === userId);
//       userTasks.forEach(task => {
//         this.taskService.deleteTask(task.id);
//       });
      
//       this.userService.deleteUser(userId);
//       this.loadData();
//     }
//   }

//   deleteTask(taskId: string): void {
//     if (confirm('Are you sure you want to delete this task?')) {
//       this.taskService.deleteTask(taskId);
//       this.loadData();
//     }
//   }

//   getUserName(userId: string): string {
//     const user = this.users.find(u => u.id === userId);
//     return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
//   }

//   getPriorityClass(priority: string): string {
//     return `priority-${priority.toLowerCase()}`;
//   }

//   getStatusClass(status: string): string {
//     return `status-${status.toLowerCase().replace(' ', '-')}`;
//   }
// }




import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TaskService } from '../../services/task.service';
import { User } from '../../models/user.model';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  tasks: Task[] = [];
  stats = {
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0
  };

  // User editing variables
  editingUser: User | null = null;
  editUserForm = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'user' as 'admin' | 'user'
  };
  showEditModal = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.users = this.userService.getAllUsers();
    this.tasks = this.taskService.getAllTasks();
    this.calculateStats();
  }

  calculateStats(): void {
    this.stats.totalUsers = this.users.filter(u => u.role === 'user').length;
    this.stats.totalTasks = this.tasks.length;
    this.stats.completedTasks = this.tasks.filter(t => t.status === 'Completed').length;
    this.stats.pendingTasks = this.tasks.filter(t => t.status === 'Pending').length;
    this.stats.highPriorityTasks = this.tasks.filter(t => t.priority === 'High').length;
  }

  // User Management Functions
  editUser(user: User): void {
    this.editingUser = user;
    this.editUserForm = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };
    this.showEditModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveUserChanges(): void {
    if (!this.editingUser) return;

    if (!this.editUserForm.firstName || !this.editUserForm.lastName || !this.editUserForm.email) {
      this.errorMessage = 'Please fill all fields';
      return;
    }

    if (this.userService.updateUser(this.editingUser.id, {
      firstName: this.editUserForm.firstName,
      lastName: this.editUserForm.lastName,
      email: this.editUserForm.email,
      role: this.editUserForm.role
    })) {
      this.successMessage = 'User updated successfully!';
      this.loadData();
      setTimeout(() => {
        this.closeEditModal();
      }, 1500);
    } else {
      this.errorMessage = 'Failed to update user or email already exists';
    }
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editingUser = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user? This will also delete all their tasks.')) {
      const userTasks = this.tasks.filter(t => t.userId === userId);
      userTasks.forEach(task => {
        this.taskService.deleteTask(task.id);
      });
      
      this.userService.deleteUser(userId);
      this.loadData();
    }
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId);
      this.loadData();
    }
  }

  getUserName(userId: string): string {
    const user = this.users.find(u => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }
}
