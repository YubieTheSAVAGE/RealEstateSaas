"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KanbanBoard from "@/components/task/kanban/KanbanBoard";
import TaskHeader from "@/components/task/TaskHeader";
import React, { useState, useEffect, useCallback } from "react";
import getTasks from "@/components/task/kanban/getTask"
import getTaskByUser from "@/components/task/kanban/getTaskByUser";
import { Task } from "@/components/task/kanban/types/types";
import { getUserRoleFromToken } from "@/app/(auth)/signin/login";

export default function TaskKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  
  const fetchTasks = async () => {
    const role = await getUserRoleFromToken();
    if (role === "ADMIN") {
      const data = await getTasks();
      console.log("Fetched Tasks:", data);
      setTasks(data);
    }else
    {
      const data = await getTaskByUser();
      setTasks(data);
    }
  };
  
  // Fetch tasks whenever refreshTrigger changes
  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);
  
  // Callback to trigger refresh when a task is added
  const handleTaskAdded = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  // Handle tasks updates from KanbanBoard
  const handleTasksUpdated = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  }, []);
  
  const [selectedTaskGroup, setSelectedTaskGroup] = useState<string>("All");
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Les Taches" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <TaskHeader 
          selectedTaskGroup={selectedTaskGroup} 
          tasks={tasks} 
          setSelectedTaskGroup={setSelectedTaskGroup}
          onTaskAdded={handleTaskAdded}
        />
        <KanbanBoard 
          selectedTaskGroup={selectedTaskGroup} 
          tasks={tasks}
          onTasksUpdated={handleTasksUpdated} 
        />
      </div>
    </div>
  );
}