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
  onTasksUpdated?: (updatedTasks: Task[]) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  selectedTaskGroup,
  tasks,
  onTasksUpdated
}) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  const tasksToDisplay = selectedTaskGroup === "All"
    ? filteredTasks
    : filteredTasks.filter(task => task.status === selectedTaskGroup);

  // Move tasks within the board (drag and drop)
  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setFilteredTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const draggedTask = newTasks[dragIndex];
      newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedTask);

      // Notify parent about the update
      if (onTasksUpdated) {
        onTasksUpdated(newTasks);
      }

      return newTasks;
    });
  }, [onTasksUpdated]);

  // Change task status (column)
  const changeTaskStatus = useCallback((taskId: string, newStatus: string) => {
    // Call API to update task status
    changeTaskStatuss(taskId, newStatus);

    setFilteredTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      );

      // Notify parent about the update
      if (onTasksUpdated) {
        onTasksUpdated(updatedTasks);
      }

      return updatedTasks;
    });
  }, [onTasksUpdated]);

  // Handle task updates from the modal
  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setFilteredTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );

      // Notify parent about the update
      if (onTasksUpdated) {
        onTasksUpdated(updatedTasks);
      }

      return updatedTasks;
    });
  }, [onTasksUpdated]); return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 border-t border-gray-200 divide-x divide-gray-200 dark:divide-white/[0.05] mt-7 dark:border-white/[0.05] sm:mt-0 sm:grid-cols-2 xl:grid-cols-3">
        <Column
          title="À faire"
          tasks={tasksToDisplay.filter((task) => task.status === "TODO")}
          status="TODO"
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
          onTaskUpdated={handleTaskUpdate}
        />
        <Column
          title="En cours"
          tasks={tasksToDisplay.filter((task) => task.status === "IN_PROGRESS")}
          status="IN_PROGRESS"
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
          onTaskUpdated={handleTaskUpdate}
        />
        <Column
          title="Terminé"
          tasks={tasksToDisplay.filter((task) => task.status === "COMPLETED")}
          status="COMPLETED"
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
          onTaskUpdated={handleTaskUpdate}
        />
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
