"use client";
import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import { Task } from "./types/types";
import { useEffect } from "react";
import changeTaskStatuss from "./changeTaskStatus";

interface KanbanBoardProps {
  selectedTaskGroup: string; // Adjust the type based on your actual data
  tasks: Task[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ selectedTaskGroup, tasks }) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  useEffect(() => {
      setFilteredTasks(tasks);
  }, [tasks]);
  const tasksToDisplay = selectedTaskGroup === "All"
    ? filteredTasks
    : filteredTasks.filter(task => task.status === selectedTaskGroup);
  // console.log("Filtered Tasks:", filteredTasks);
  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setFilteredTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const draggedTask = newTasks[dragIndex];
      newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedTask);
      return newTasks;
    });
  }, []);

  const changeTaskStatus = useCallback((taskId: string, newStatus: string) => {
    changeTaskStatuss(taskId, newStatus);
    setFilteredTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 border-t border-gray-200 divide-x divide-gray-200 dark:divide-white/[0.05] mt-7 dark:border-white/[0.05] sm:mt-0 sm:grid-cols-2 xl:grid-cols-3">
        {tasksToDisplay.some(task => task.status === "TODO") && (
          <Column
            title="To Do"
            tasks={tasks.filter((task) => task.status === "TODO")}
            status="todo"
            moveTask={moveTask}
            changeTaskStatus={changeTaskStatus}
          />
        )}
        {tasksToDisplay.some(task => task.status === "IN_PROGRESS") && (
          <Column
            title="In Progress"
            tasks={tasks.filter((task) => task.status === "IN_PROGRESS")}
            status="inProgress"
            moveTask={moveTask}
            changeTaskStatus={changeTaskStatus}
          />
        )}
        {tasksToDisplay.some(task => task.status === "COMPLETED") && (
          <Column
            title="Completed"
            tasks={tasks.filter((task) => task.status === "COMPLETED")}
            status="completed"
            moveTask={moveTask}
            changeTaskStatus={changeTaskStatus}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
