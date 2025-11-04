import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task: Partial<Task> = {
    name: '',
    description: '',
    dueDate: new Date(),
    priority: 'Medium',
    status: 'Pending'
  };
  isEditMode = false;
  taskId: string | null = null;
  errorMessage = '';
  successMessage = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      this.loadTask();
    }
  }

  loadTask(): void {
    if (this.taskId) {
      const existingTask = this.taskService.getTaskById(this.taskId);
      if (existingTask) {
        this.task = { ...existingTask };
      } else {
        this.errorMessage = 'Task not found';
      }
    }
  }

  onSubmit(): void {
    if (!this.task.name || !this.task.description || !this.task.dueDate) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (this.isEditMode && this.taskId) {
      if (this.taskService.updateTask(this.taskId, this.task)) {
        this.successMessage = 'Task updated successfully!';
        setTimeout(() => {
          this.router.navigate(['/tasks']);
        }, 1500);
      } else {
        this.errorMessage = 'Failed to update task';
      }
    } else {
      if (this.taskService.createTask(this.task as Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>)) {
        this.successMessage = 'Task created successfully!';
        setTimeout(() => {
          this.router.navigate(['/tasks']);
        }, 1500);
      } else {
        this.errorMessage = 'Failed to create task';
      }
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }
}
