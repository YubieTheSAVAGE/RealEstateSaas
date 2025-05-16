"use client";

import Link from "next/link";
import { formatNotificationDate, formatNotificationTime, getNotificationPriorityClass } from "./formatters";
import { TaskNotification } from "./taskNotifications";

interface TaskNotificationItemProps {
  task: TaskNotification;
  isOverdue: boolean;
  onItemClick: () => void;
}

export default function TaskNotificationItem({ task, isOverdue, onItemClick }: TaskNotificationItemProps) {
  const formattedDate = formatNotificationDate(task.dueDate);
  const formattedTime = formatNotificationTime(task.dueDate);
  const priorityClass = getNotificationPriorityClass(task.dueDate, task.status);
  
  return (
    <li>
      <Link 
        href={`/tasks?id=${task.id}`} 
        className="flex gap-3 rounded-lg border-b border-gray-100 p-3 px-4.5 py-3 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-white/5"
        onClick={onItemClick}
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <svg
            className="fill-current text-gray-700 dark:text-gray-300"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.33329 1.0835C5.74751 1.0835 6.08329 1.41928 6.08329 1.8335V2.25016L9.91663 2.25016V1.8335C9.91663 1.41928 10.2524 1.0835 10.6666 1.0835C11.0808 1.0835 11.4166 1.41928 11.4166 1.8335V2.25016L12.3333 2.25016C13.2998 2.25016 14.0833 3.03366 14.0833 4.00016V6.00016L14.0833 12.6668C14.0833 13.6333 13.2998 14.4168 12.3333 14.4168L3.66663 14.4168C2.70013 14.4168 1.91663 13.6333 1.91663 12.6668V6.00016V4.00016C1.91663 3.03366 2.70013 2.25016 3.66663 2.25016L4.58329 2.25016V1.8335C4.58329 1.41928 4.91908 1.0835 5.33329 1.0835ZM12.5833 6.00016L3.41663 6.00016V12.6668C3.41663 12.7951 3.53835 12.9168 3.66663 12.9168L12.3333 12.9168C12.4616 12.9168 12.5833 12.7951 12.5833 12.6668V6.00016ZM8.08329 8.91683C8.08329 8.50262 7.74751 8.16683 7.33329 8.16683C6.91908 8.16683 6.58329 8.50262 6.58329 8.91683C6.58329 9.33105 6.91908 9.66683 7.33329 9.66683C7.74751 9.66683 8.08329 9.33105 8.08329 8.91683ZM10.6666 8.16683C11.0808 8.16683 11.4166 8.50262 11.4166 8.91683C11.4166 9.33105 11.0808 9.66683 10.6666 9.66683C10.2524 9.66683 9.91662 9.33105 9.91662 8.91683C9.91662 8.50262 10.2524 8.16683 10.6666 8.16683ZM4.58329 11.4168C4.58329 11.0026 4.91908 10.6668 5.33329 10.6668C5.74751 10.6668 6.08329 11.0026 6.08329 11.4168C6.08329 11.831 5.74751 12.1668 5.33329 12.1668C4.91908 12.1668 4.58329 11.831 4.58329 11.4168ZM7.33329 10.6668C6.91908 10.6668 6.58329 11.0026 6.58329 11.4168C6.58329 11.831 6.91908 12.1668 7.33329 12.1668C7.74751 12.1668 8.08329 11.831 8.08329 11.4168C8.08329 11.0026 7.74751 10.6668 7.33329 10.6668ZM9.91662 11.4168C9.91662 11.0026 10.2524 10.6668 10.6666 10.6668C11.0808 10.6668 11.4166 11.0026 11.4166 11.4168C11.4166 11.831 11.0808 12.1668 10.6666 12.1668C10.2524 12.1668 9.91662 11.831 9.91662 11.4168Z"
              fill="currentColor"
            />
          </svg>
        </span>

        <span className="block">
          <span className="mb-1.5 space-x-1 block text-theme-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-800 dark:text-white/90">
              {isOverdue ? "Overdue" : "Upcoming"} Task
            </span>
            <span>-</span>
            <span className="font-medium text-gray-800 dark:text-white/90">
              {task.title}
            </span>
          </span>

          <div className="flex items-center gap-2 text-gray-500 text-theme-xs dark:text-gray-400">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span>{formattedTime}</span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className={`inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium ${priorityClass}`}>
              {task.status === "TODO" ? "To Do" : 
               task.status === "IN_PROGRESS" ? "In Progress" : 
               task.status === "COMPLETED" ? "Completed" : task.status}
            </span>
          </div>
        </span>
      </Link>
    </li>
  );
}
