export interface Task {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  description: string;
  status: string;
  createdBy?: { name: string };
  comments: [];
}

export interface DropResult {
  name: string;
}
