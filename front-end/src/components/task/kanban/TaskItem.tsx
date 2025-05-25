import React, { useRef, useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Task, DropResult } from "./types/types";
import TaskDetailModal from "../detail/TaskDetailModal";
import { updateTask } from "../detail/taskDetailActions";
import { getUserRoleFromToken } from "@/app/(auth)/signin/login";

interface TaskItemProps {
  task: Task;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  changeTaskStatus: (taskId: string, newStatus: string) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  moveTask,
  changeTaskStatus,
  onTaskUpdated
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task>(task);
  
  // Open the task detail modal
  const handleTaskClick = (e: React.MouseEvent) => {
    // Prevent click from triggering drag
    if (e.target === e.currentTarget || 
        !(e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsModalOpen(true);
    }
  };
  const [role, setRole] = useState<string>("");
  useEffect(() => {
    const fetchRole = async () => {
      const userRole = await getUserRoleFromToken();
      setRole(userRole as string);
    };
    fetchRole();
  }, []);
    
  
  // Handle task updates from the modal
  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      // Call the API to update the task
      await updateTask(updatedTask);
      
      // Update the local task state
      setCurrentTask(updatedTask);
      
      // Notify parent components about the update
      if (onTaskUpdated) {
        onTaskUpdated(updatedTask);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };
  const [{ handlerId }, drop] = useDrop<
    Task & { index: number },
    DropResult,
    { handlerId: string | symbol | null }
  >({
    accept: "TASK", // Use a single type for all tasks
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    drop: () => ({ name: task.status }),
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag<
    Task,
    DropResult,
    { isDragging: boolean }
  >({
    type: "TASK", // Use a single type for all tasks
    item: () => ({ ...task, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.name !== item.status) {
        changeTaskStatus(item.id, dropResult.name);
      }
    },
  });  

  const opacity = isDragging ? 0.3 : 0.8;
  drag(drop(ref));

  return (
    <>
      <div
        ref={ref}
        style={{ opacity }}
        className="relative p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5 cursor-pointer hover:shadow-md transition-shadow duration-200"
        data-handler-id={handlerId}
        onClick={handleTaskClick}
      >
        <div className="space-y-4">
          <div>
            {role === "ADMIN" && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {currentTask.createdBy?.name}
              </p>
            )}
            <h4 className="mb-5 mr-10 text-base text-gray-800 dark:text-white/90">
              {currentTask.title}
            </h4>

            {/* Task description preview - show first 60 characters if available */}
            {currentTask.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                {currentTask.description.length > 60 
                  ? `${currentTask.description.substring(0, 60)}...` 
                  : currentTask.description}
              </p>
            )}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668L1.91663 6.00016L1.91663 4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM5.33329 3.75016L3.66663 3.75016C3.52855 3.75016 3.41663 3.86209 3.41663 4.00016V5.25016L12.5833 5.25016V4.00016C12.5833 3.86209 12.4714 3.75016 12.3333 3.75016L10.6666 3.75016L5.33329 3.75016ZM12.5833 6.75016L3.41663 6.75016L3.41663 12.6668C3.41663 12.8049 3.52855 12.9168 3.66663 12.9168L12.3333 12.9168C12.4714 12.9168 12.5833 12.8049 12.5833 12.6668L12.5833 6.75016Z"
                    fill=""
                  />
                </svg>
                  {new Date(currentTask.dueDate).toLocaleString("en-US", {dateStyle: "medium", timeStyle: "short"})}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
                <svg
                  className="stroke-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 15.6343C12.6244 15.6343 15.5625 12.6961 15.5625 9.07178C15.5625 5.44741 12.6244 2.50928 9 2.50928C5.37563 2.50928 2.4375 5.44741 2.4375 9.07178C2.4375 10.884 3.17203 12.5246 4.35961 13.7122L2.4375 15.6343H9Z"
                    stroke=""
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                {currentTask.comments.length}
              </span>
            </div>
            {/* Task status indicator */}
            <span 
              className={`mt-3 inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium ${
                currentTask.status === "TODO" 
                  ? "bg-gray-100 text-gray-700 dark:bg-white/[0.03] dark:text-white/80" 
                  : currentTask.status === "IN_PROGRESS" 
                  ? "text-warning-700 bg-warning-50 dark:bg-warning-500/15 dark:text-orange-400" 
                  : "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400"
              }`}
            >
              {currentTask.status === "TODO" ? "To Do" : 
               currentTask.status === "IN_PROGRESS" ? "In Progress" : 
               "Completed"}
            </span>
          </div>
        </div>
        <div className="h-6 absolute top-5 right-5 top w-full max-w-6 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800 drag-handle">
          {/* Drag handle icon */}
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>
      
      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={{
          ...currentTask,
          comments: Array.isArray(currentTask.comments) ? currentTask.comments : []
        }}
        onTaskUpdate={handleTaskUpdate}
      />
    </>
  );
};

export default TaskItem;
