import { create } from "zustand";
import { Task } from "@/components/task/kanban/types/types";

interface TaskStore {
  tasks: Record<string, Task[]>;
  moveTask: (fromColumnId: string, toColumnId: string, fromIndex: number, toIndex: number) => void;
  addTask: (columnId: string, task: Task) => void;
  updateTask: (columnId: string, taskId: string, updatedTask: Partial<Task>) => void;
  deleteTask: (columnId: string, taskId: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: {},
  moveTask: (fromColumnId, toColumnId, fromIndex, toIndex) =>
    set((state) => {
      const newTasks = { ...state.tasks };
      const [movedTask] = newTasks[fromColumnId].splice(fromIndex, 1);
      newTasks[toColumnId].splice(toIndex, 0, movedTask);
      return { tasks: newTasks };
    }),
  addTask: (columnId, task) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [columnId]: [...(state.tasks[columnId] || []), task],
      },
    })),
  updateTask: (columnId, taskId, updatedTask) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [columnId]: state.tasks[columnId].map((task) =>
          task.id === taskId ? { ...task, ...updatedTask } : task
        ),
      },
    })),
  deleteTask: (columnId, taskId) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [columnId]: state.tasks[columnId].filter((task) => task.id !== taskId),
      },
    })),
})); 