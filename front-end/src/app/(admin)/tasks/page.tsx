"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import KanbanBoard from "@/components/task/kanban/KanbanBoard";
import TaskHeader from "@/components/task/TaskHeader";
import { Metadata } from "next";
import React, { use, useState, useEffect } from "react";
import getTasks from "@/components/task/kanban/getTask"
import { Task } from "@/components/task/kanban/types/types";
  

// export const metadata: Metadata = {
//   title: "Immo360 | Tasks",
//   description: "This is Immo360 Tasks Page",
// };

export default function TaskKanban() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      console.log("Fetched Tasks:", data);
      setTasks(data);
    };
    fetchTasks();
  }, []);
  const [selectedTaskGroup, setSelectedTaskGroup] = useState<string>("All");
  return (
    <div>
      <PageBreadcrumb pageTitle="Task Kanban" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <TaskHeader selectedTaskGroup={selectedTaskGroup} tasks={tasks} setSelectedTaskGroup={setSelectedTaskGroup}/>
        <KanbanBoard selectedTaskGroup={selectedTaskGroup} tasks={tasks} />
      </div>
    </div>
  );
}