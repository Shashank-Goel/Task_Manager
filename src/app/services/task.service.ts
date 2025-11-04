import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private authService: AuthService) {}

  getTasks(): Task[] {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];

    const tasks = this.getAllTasks();
    return this.authService.isAdmin() 
      ? tasks 
      : tasks.filter(task => task.userId === currentUser.id);
  }

  getAllTasks(): Task[] {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
  }

  createTask(taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    const tasks = this.getAllTasks();
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      userId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return true;
  }

  updateTask(taskId: string, taskData: Partial<Task>): boolean {
    const tasks = this.getAllTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = { 
        ...tasks[taskIndex], 
        ...taskData, 
        updatedAt: new Date() 
      };
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return true;
    }
    return false;
  }

  deleteTask(taskId: string): boolean {
    const tasks = this.getAllTasks();
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    return true;
  }

  getTaskById(taskId: string): Task | undefined {
    return this.getAllTasks().find(t => t.id === taskId);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
