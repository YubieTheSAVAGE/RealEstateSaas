"use client";
import React, { useState, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Column from "./Column";
import { Task } from "./types/types";

export const initialTasks: Task[] = [
  {
    id: "1",
    title: "Finish user onboarding",
    dueDate: "Tomorrow",
    dueTime: "10:00",
    description: "Finish user onboarding",
    status: "todo",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "2",
    title: "Solve the dribble prioritization issue with the team",
    dueDate: "Jan 08, 2027",
    dueTime: "10:00",
    description: "Solve the dribble prioritization issue with the team",
    status: "todo",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "3",
    title: "Change license and remove products",
    dueDate: "Jan 08, 2027",
    dueTime: "10:00",
    description: "Change license and remove products",
    status: "todo",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "4",
    title: "Change license and remove products",
    dueDate: "Jan 8, 2027",
    dueTime: "10:00",
    description: "Change license and remove products",
    status: "todo",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "5",
    title: "Work in progress(WIP) Dashboard",
    dueDate: "Today",
    dueTime: "10:00",
    description: "Work in progress(WIP) Dashboard",
    status: "inProgress",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "6",
    title: "Kanban  manager",
    dueDate: "Jan 08, 2027",
    dueTime: "10:00",
    description: "Kanban  manager",
    status: "inProgress",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "7",
    title: "Product Update - Q4 (2024)",
    dueDate: "Today",
    dueTime: "10:00",
    description: "Product Update - Q4 (2024)",
    status: "inProgress",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "8",
    title: "Make figbot send comment when ticket is auto-moved back to inbox",
    dueDate: "Mar 08, 2027",
    dueTime: "10:00",
    description: "Make figbot send comment when ticket is auto-moved back to inbox",
    status: "inProgress",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "9",
    title: "Manage internal feedback",
    dueDate: "Tomorrow",
    dueTime: "10:00",
    description: "Manage internal feedback",
    status: "completed",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "10",
    title: "Do some projects on React Native with Flutter",
    dueDate: "Jan 8, 2027",
    dueTime: "10:00",
    description: "Do some projects on React Native with Flutter",
    status: "completed",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "11",
    title: "Design marketing assets",
    dueDate: "Jan 08, 2027",
    dueTime: "10:00",
    description: "Design marketing assets",
    status: "completed",
    comments: ["Comment 1", "Comment 2"],
  },
  {
    id: "12",
    title: "Kanban flow manager",
    dueDate: "Jan 08, 2027",
    dueTime: "10:00",
    description: "Kanban flow manager",
    status: "completed",
    comments: ["Comment 1", "Comment 2"],
  },
];

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasks((prevTasks) => {
      const newTasks = [...prevTasks];
      const draggedTask = newTasks[dragIndex];
      newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedTask);
      return newTasks;
    });
  }, []);

  const changeTaskStatus = useCallback((taskId: string, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 border-t border-gray-200 divide-x divide-gray-200 dark:divide-white/[0.05] mt-7 dark:border-white/[0.05] sm:mt-0 sm:grid-cols-2 xl:grid-cols-3">
        <Column
          title="To Do"
          tasks={tasks.filter((task) => task.status === "todo")}
          status="todo"
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
        />
        <Column
          title="In Progress"
          tasks={tasks.filter((task) => task.status === "inProgress")}
          status="inProgress"
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
        />
        <Column
          title="Completed"
          tasks={tasks.filter((task) => task.status === "completed")}
          status="completed"
          moveTask={moveTask}
          changeTaskStatus={changeTaskStatus}
        />
      </div>
    </DndProvider>
  );
};

export default KanbanBoard;
