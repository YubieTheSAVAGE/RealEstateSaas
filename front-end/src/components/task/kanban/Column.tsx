"use client";
import React, { useState, useRef } from "react";
import { Task, DropResult } from "./types/types";
import TaskItem from "./TaskItem";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import { useDrop } from "react-dnd";

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
  changeTaskStatus: (taskId: string, newStatus: string) => void;
  onTaskUpdated?: (updatedTask: Task) => void;
}

const Column: React.FC<ColumnProps> = ({
  title,
  tasks,
  status,
  moveTask,
  changeTaskStatus,
  onTaskUpdated
}) => {
  const [isOpen, setIsOpen] = useState(false);

  function closeDropdown() {
    setIsOpen(false);
  }

  // Add drop target functionality to the column
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop<Task, DropResult, { isOver: boolean }>({
    accept: "TASK",
    drop: () => ({ name: status }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(ref);

  return (
    <div 
      ref={ref}
      className={`flex flex-col gap-5 p-4 swim-lane xl:p-6 ${isOver ? 'bg-gray-50 dark:bg-gray-900/50' : ''}`}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
          {title}          <span
            className={`
    inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium 
    ${
      status === "TODO"
        ? "bg-gray-100 text-gray-700 dark:bg-white/[0.03] dark:text-white/80 "
        : status === "IN_PROGRESS"
        ? "text-warning-700 bg-warning-50 dark:bg-warning-500/15 dark:text-orange-400"
        : status === "COMPLETED"
        ? "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500"
        : ""
    }
  `}
          >
            {tasks.length}
          </span>
        </h3>
        <div className="relative">
          {/* <button onClick={toggleDropdown} className="dropdown-toggle">
            <HorizontaLDots className="text-gray-800 hover:text-gray-700 dark:hover:text-gray-300" />
          </button> */}
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="absolute right-0 top-full z-40 w-[140px] space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-theme-md dark:border-gray-800 dark:bg-gray-dark"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Edit
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Tout effacer
            </DropdownItem>
          </Dropdown>
        </div>
      </div>      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
          onTaskUpdated={onTaskUpdated}
        />
      ))}
    </div>
  );
};

export default Column;
