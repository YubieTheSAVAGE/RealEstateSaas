"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import TextArea from "../../form/input/TextArea";
import { Task } from "../kanban/types/types";
import { formatNotificationDate, formatNotificationTime } from "../notifications/formatters";
import { updateTask as updateTaskAPI, addComment as addCommentAPI, getTaskComments } from './taskDetailActions';

// Define a Comment type based on the Prisma schema
interface Comment {
  id: number;
  content: string;
  taskId: number;
  createdAt: Date;
}

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdate: (updatedTask: Task) => void;
}

export default function TaskDetailModal({ 
  isOpen, 
  onClose, 
  task, 
  onTaskUpdate 
}: TaskDetailModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    description: "",
    dueDate: "",
    status: "TODO",
    comments: [],
  });
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Update form data when task changes
  useEffect(() => {
    if (task) {
      // Format the date for the datetime-local input
      const dueDate = new Date(task.dueDate);
      const formattedDate = dueDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
      
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: formattedDate,
        status: task.status,
        comments: task.comments,
      });
    }
  }, [task]);

  if (!task) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleNewCommentChange = (value: string) => {
    setNewComment(value);
  };

  const handleSubmit = async () => {
    if (!task || !formData.title) return;
    
    try {
      setLoading(true);
      
      // Create updated task object
      const updatedTask: Task = {
        ...task,
        title: formData.title || task.title,
        description: formData.description || task.description,
        dueDate: formData.dueDate || task.dueDate,
        status: (formData.status as "TODO" | "IN_PROGRESS" | "COMPLETED") || task.status,
        comments: formData.comments || task.comments,
      };
      
      // Call API to update task
      await updateTaskAPI(updatedTask);
      
      // Update local state
      onTaskUpdate(updatedTask);
      // Close modal
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;
    
    try {
      setLoading(true);
      
      // Call API to add comment and use the response
      await addCommentAPI(task.id, newComment);
      
      // Fetch updated comments to ensure we have the latest data
      const response = await getTaskComments(task.id);
      console.log("Fetched comments:", response);
      
      // Update task with new comment
      const updatedTask: Task = {
        ...task,
        comments: response,
      };
      
      // Update local state
        onTaskUpdate(updatedTask);
      
      // Clear comment input
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoading(false);
    }
  };

  // Temporary mock API functions (will be replaced with actual API calls)
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[700px] p-5 lg:p-10 m-4"
    >
      <div className="px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Modifier la tâche
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          Mettre à jour les détails de la tâche ou ajouter des commentaires
        </p>
      </div>

      <div className="custom-scrollbar h-[450px] overflow-y-auto px-2">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">          {/* Task Title */}
          <div className="sm:col-span-2">
            <Label>Task Title</Label>
            <Input 
              type="text" 
              name="title" 
              defaultValue={formData.title} 
              onChange={handleChange} 
            />
          </div>

          {/* Due Date */}
          <div>
            <Label>Due Date</Label>
            <div className="relative">
              <Input 
                type="datetime-local" 
                name="dueDate" 
                defaultValue={formData.dueDate} 
                onChange={handleChange} 
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-gray-700 dark:fill-gray-400"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.33317 0.0830078C4.74738 0.0830078 5.08317 0.418794 5.08317 0.833008V1.24967H8.9165V0.833008C8.9165 0.418794 9.25229 0.0830078 9.6665 0.0830078C10.0807 0.0830078 10.4165 0.418794 10.4165 0.833008V1.24967L11.3332 1.24967C12.2997 1.24967 13.0832 2.03318 13.0832 2.99967V4.99967V11.6663C13.0832 12.6328 12.2997 13.4163 11.3332 13.4163L2.6665 13.4163C1.70001 13.4163 0.916504 12.6328 0.916504 11.6663V4.99967V2.99967C0.916504 2.03318 1.70001 1.24967 2.6665 1.24967L3.58317 1.24967V0.833008C3.58317 0.418794 3.91896 0.0830078 4.33317 0.0830078ZM11.5832 4.99967V2.99967C11.5832 2.8716 11.4712 2.74967 11.3332 2.74967L9.6665 2.74967L4.33317 2.74967L2.6665 2.74967C2.52844 2.74967 2.4165 2.8716 2.4165 2.99967V4.99967L11.5832 4.99967ZM2.4165 6.49967V11.6663C2.4165 11.7944 2.52844 11.9163 2.6665 11.9163L11.3332 11.9163C11.4712 11.9163 11.5832 11.7944 11.5832 11.6663V6.49967L2.4165 6.49967Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Statut</Label>
            <div className="relative z-20 bg-transparent dark:bg-form-input">              <select
                name="status" 
                defaultValue={formData.status}
                onChange={handleChange}
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option
                  value="TODO"
                  className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  À faire
                </option>
                <option
                  value="IN_PROGRESS"
                  className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  En cours
                </option>
                <option
                  value="COMPLETED"
                  className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  Terminé
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

          {/* Description */}
          <div className="sm:col-span-2">
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              placeholder="Task description..."
              rows={4}
              onChange={handleTextAreaChange}
            />
          </div>

          {/* Comments Section */}
          <div className="sm:col-span-2 mt-4">
            <h5 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
              Comments ({formData.comments?.length || 0})
            </h5>
            <div className="max-h-[150px] overflow-y-auto border border-gray-200 rounded-lg p-3 mb-4 dark:border-gray-700">
              {(formData.comments?.length === 0) ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No comments yet</p>
              ) : (
                <ul className="space-y-3">
                {(formData.comments || []).map((comment: Comment, index) => (
                    <li key={index} className="pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <p className="text-sm text-gray-800 dark:text-white/90">{comment.content}</p>
                    <span className="text-xs text-gray-500">Comment #{index + 1}</span>
                    </li>
                ))}
                </ul>
              )}
            </div>
            
            <Label>Ajouter un commentaire</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <TextArea
                  name="newComment"
                  value={newComment}
                  placeholder="Add your comment..."
                  rows={2}
                  onChange={handleNewCommentChange}
                />
              </div>
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim() || loading}
                className="h-fit mt-auto"
                size="sm"
              >
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 px-2 mt-6 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          {/* Task info summary */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Created: {formatNotificationDate(task.dueDate)}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>Due: {formatNotificationTime(task.dueDate)}</span>
          </div>
        </div>

        <div className="flex items-center w-full gap-3 sm:w-auto">
          <button
            onClick={onClose}
            type="button"
            className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={loading}
            className="flex w-full items-center justify-center gap-1 rounded-lg border border-brand-500 bg-brand-500 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-600 hover:border-brand-600 focus:ring-4 focus:ring-brand-100 disabled:bg-brand-300 disabled:hover:bg-brand-300 dark:border-brand-500 dark:bg-brand-500 dark:focus:ring-brand-600/30 dark:disabled:bg-brand-500/50 sm:w-auto"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
