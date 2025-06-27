import { create } from "zustand";
import { Task } from "@/components/task/kanban/types/types";

interface ModalStore {
  isOpen: boolean;
  task: Task | null;
  openModal: (task: Task) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  task: null,
  openModal: (task: Task) => set({ isOpen: true, task }),
  closeModal: () => set({ isOpen: false, task: null }),
})); 