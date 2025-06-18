export interface Task {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string;
  description: string;
  status: string;
  createdBy?: { name: string };
  comments: [];
  _deleted?: boolean; // Special flag to indicate task deletion
}

export interface DropResult {
  name: string;
}
