export interface Task {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
