import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm = '';
  filterStatus = '';
  filterPriority = '';
  currentPage = 1;
  tasksPerPage = 6;
  sortBy = 'createdAt';
  sortOrder = 'desc';

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks = this.taskService.getTasks();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.filterStatus || task.status === this.filterStatus;
      const matchesPriority = !this.filterPriority || task.priority === this.filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    this.sortTasks();
    this.currentPage = 1;
  }

  sortTasks(): void {
    this.filteredTasks.sort((a, b) => {
      let valueA = a[this.sortBy as keyof Task];
      let valueB = b[this.sortBy as keyof Task];
      
      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  deleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId);
      this.loadTasks();
    }
  }

  editTask(taskId: string): void {
    this.router.navigate(['/task-form', taskId]);
  }

  get paginatedTasks(): Task[] {
    const startIndex = (this.currentPage - 1) * this.tasksPerPage;
    return this.filteredTasks.slice(startIndex, startIndex + this.tasksPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTasks.length / this.tasksPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(' ', '-')}`;
  }
}
