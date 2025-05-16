export interface Task {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  description: string;
  status: string;
  comments: [];
}

export interface DropResult {
  name: string;
}
