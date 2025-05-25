"use client";
import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import { Task } from "./kanban/types/types";
import addTask from "@/app/(admin)/tasks/addTask";

// Define the TaskHeaderProps interface
interface TaskHeaderProps {
  selectedTaskGroup: string;
  setSelectedTaskGroup: (group: string) => void;
  tasks: Task[];
  onTaskAdded?: () => void; // Add this callback prop
}

export default function TaskHeader({ selectedTaskGroup, setSelectedTaskGroup, tasks, onTaskAdded }: TaskHeaderProps) {
  
  const { isOpen, openModal, closeModal } = useModal();
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    status: "TODO",
    description: "",
  });
  
  // State for validation errors
  const [errors, setErrors] = useState({
    title: "",
    dueDate: "",
    description: "",
  });
  
  // State for form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskGroups = [
    { 
      name: "All Tasks", 
      key: "All", 
      count: tasks.length 
    },
    { 
      name: "To do", 
      key: "TODO", 
      count: tasks.filter((task: Task) => task.status === "TODO").length 
    },
    { 
      name: "In Progress", 
      key: "IN_PROGRESS", 
      count: tasks.filter((task: Task) => task.status === "IN_PROGRESS").length 
    },
    { 
      name: "Completed", 
      key: "COMPLETED", 
      count: tasks.filter((task: Task) => task.status === "COMPLETED").length 
    },
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  function handleTextAreaChange(value: string): void {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
    
    // Clear error when user starts typing
    if (errors.description) {
      setErrors((prev) => ({
        ...prev,
        description: "",
      }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      // Handle form submission logic here
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
            formDataToSend.append(key, String(value))
        }
      });
      
      await addTask(formDataToSend);
      
      // Reset form data
      setFormData({
        title: "",
        dueDate: "",
        status: "TODO",
        description: "",
      });
      
      closeModal();
      
      if (onTaskAdded) {
        onTaskAdded(); // Call the callback if provided
      }
    } catch (error) {
      console.error("Error adding task:", error);
      // You could add error handling here
    } finally {
      setIsSubmitting(false);
    }
  }

  // Function to validate form data
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      title: "",
      dueDate: "",
      description: "",
    };

    // Validate title (required)
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
      isValid = false;
    }

    // Validate due date (required)
    if (!formData.dueDate.trim()) {
      newErrors.dueDate = "Due date is required";
      isValid = false;
    }

    // Update errors state
    setErrors(newErrors);
    return isValid;
  };
  
  return (
    <>
      <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
        <div className="flex flex-col w-full gap-5 sm:justify-between xl:flex-row xl:items-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-x-1 gap-y-2 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            {taskGroups.map((group) => (
              <button
                key={group.key}
                onClick={() => setSelectedTaskGroup(group.key)}
                className={`inline-flex items-center xl:justify-start justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white ${
                  selectedTaskGroup === group.key
                    ? "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {group.name}
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 ${
                    selectedTaskGroup === group.key
                      ? "text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15"
                      : "bg-white dark:bg-white/[0.03]"
                  }`}
                >
                  {group.count}
                </span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 xl:justify-end">
            <Button variant="outline" size="sm">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.0826 4.0835C11.0769 4.0835 10.2617 4.89871 10.2617 5.90433C10.2617 6.90995 11.0769 7.72516 12.0826 7.72516C13.0882 7.72516 13.9034 6.90995 13.9034 5.90433C13.9034 4.89871 13.0882 4.0835 12.0826 4.0835ZM2.29004 6.65409H8.84671C9.18662 8.12703 10.5063 9.22516 12.0826 9.22516C13.6588 9.22516 14.9785 8.12703 15.3184 6.65409H17.7067C18.1209 6.65409 18.4567 6.31831 18.4567 5.90409C18.4567 5.48988 18.1209 5.15409 17.7067 5.15409H15.3183C14.9782 3.68139 13.6586 2.5835 12.0826 2.5835C10.5065 2.5835 9.18691 3.68139 8.84682 5.15409H2.29004C1.87583 5.15409 1.54004 5.48988 1.54004 5.90409C1.54004 6.31831 1.87583 6.65409 2.29004 6.65409ZM4.6816 13.3462H2.29085C1.87664 13.3462 1.54085 13.682 1.54085 14.0962C1.54085 14.5104 1.87664 14.8462 2.29085 14.8462H4.68172C5.02181 16.3189 6.34142 17.4168 7.91745 17.4168C9.49348 17.4168 10.8131 16.3189 11.1532 14.8462H17.7075C18.1217 14.8462 18.4575 14.5104 18.4575 14.0962C18.4575 13.682 18.1217 13.3462 17.7075 13.3462H11.1533C10.8134 11.8733 9.49366 10.7752 7.91745 10.7752C6.34124 10.7752 5.02151 11.8733 4.6816 13.3462ZM9.73828 14.096C9.73828 13.0904 8.92307 12.2752 7.91745 12.2752C6.91183 12.2752 6.09662 13.0904 6.09662 14.096C6.09662 15.1016 6.91183 15.9168 7.91745 15.9168C8.92307 15.9168 9.73828 15.1016 9.73828 14.096Z"
                  fill="currentColor"
                />
              </svg>
              Filter & Short
            </Button>
            <Button size="sm" onClick={openModal}>
              Add New Task
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.2502 4.99951C9.2502 4.5853 9.58599 4.24951 10.0002 4.24951C10.4144 4.24951 10.7502 4.5853 10.7502 4.99951V9.24971H15.0006C15.4148 9.24971 15.7506 9.5855 15.7506 9.99971C15.7506 10.4139 15.4148 10.7497 15.0006 10.7497H10.7502V15.0001C10.7502 15.4143 10.4144 15.7501 10.0002 15.7501C9.58599 15.7501 9.2502 15.4143 9.2502 15.0001V10.7497H5C4.58579 10.7497 4.25 10.4139 4.25 9.99971C4.25 9.5855 4.58579 9.24971 5 9.24971H9.2502V4.99951Z"
                  fill=""
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-5 lg:p-10 m-4"
      >
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add a new task
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Effortlessly manage your to-do list: add a new task
          </p>
        </div>

        <form className="flex flex-col">
          <div className="custom-scrollbar h-[350px] sm:h-[450px] overflow-y-auto px-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Task Title <span className="text-red-500">*</span></Label>
                <Input 
                  type="text" 
                  onChange={handleChange} 
                  name="title" 
                  error={!!errors.title}
                  hint={errors.title || ""}
                />
              </div>

              <div>
                <Label>Due Date <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input 
                    type="datetime-local" 
                    onChange={handleChange} 
                    name="dueDate" 
                    error={!!errors.dueDate}
                    hint={errors.dueDate || ""}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <svg
                      className="fill-gray-700 dark:fill-gray-400"
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.33317 0.0830078C4.74738 0.0830078 5.08317 0.418794 5.08317 0.833008V1.24967H8.9165V0.833008C8.9165 0.418794 9.25229 0.0830078 9.6665 0.0830078C10.0807 0.0830078 10.4165 0.418794 10.4165 0.833008V1.24967L11.3332 1.24967C12.2997 1.24967 13.0832 2.03318 13.0832 2.99967V4.99967V11.6663C13.0832 12.6328 12.2997 13.4163 11.3332 13.4163H2.6665C1.70001 13.4163 0.916504 12.6328 0.916504 11.6663V4.99967V2.99967C0.916504 2.03318 1.70001 1.24967 2.6665 1.24967L3.58317 1.24967V0.833008C3.58317 0.418794 3.91896 0.0830078 4.33317 0.0830078ZM4.33317 2.74967H2.6665C2.52843 2.74967 2.4165 2.8616 2.4165 2.99967V4.24967H11.5832V2.99967C11.5832 2.8616 11.4712 2.74967 11.3332 2.74967H9.6665H4.33317ZM11.5832 5.74967H2.4165V11.6663C2.4165 11.8044 2.52843 11.9163 2.6665 11.9163H11.3332C11.4712 11.9163 11.5832 11.8044 11.5832 11.6663V5.74967Z"
                        fill=""
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <Label>Status</Label>
                <div className="relative z-20 bg-transparent dark:bg-form-input">
                  <select onChange={handleStatusChange} name="status" className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                    <option
                      value="TODO"
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      To Do
                    </option>
                    <option
                      value="IN_PROGRESS"
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      In Progress
                    </option>s
                    <option
                      value="COMPLETED"
                      className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                    >
                      Completed
                    </option>
                  </select>
                  <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                    <svg
                      className="stroke-current"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                        stroke=""
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <Label>Description</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  placeholder="Type your message here..."
                  rows={6}
                  onChange={handleTextAreaChange}
                  error={!!errors.description}
                  hint={errors.description || ""}
                />
              </div>
            </div>


          </div>
          <div className="flex flex-col items-center gap-6 px-2 mt-6 sm:flex-row sm:justify-between">
            <div className="flex flex-col items-center gap-3 sm:flex-row">

            </div>

            <div className="flex items-center w-full gap-3 sm:w-auto">
              <button
                onClick={closeModal}
                type="button"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                type="button"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
