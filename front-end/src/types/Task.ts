export enum TodoStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  createdAt: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: Date;
  status: TodoStatus;
  createdById?: number;
  createdBy?: {
    id: number;
    name: string;
    email: string;
    // Other relevant User fields
  };
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
}
