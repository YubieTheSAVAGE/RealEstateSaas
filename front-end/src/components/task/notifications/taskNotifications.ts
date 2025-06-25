"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

export interface TaskNotification {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

export interface TaskNotifications {
  overdue: TaskNotification[];
  upcoming: TaskNotification[];
}

// Get all tasks from API
export default async function getTasks() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}` 
      },
    });
    
    if (!res.ok) {
      console.error("Error getting tasks:", res.statusText);
      return [];
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

// Get task notifications by filtering tasks based on due date
export async function getTaskNotifications(tasks: TaskNotification[]): Promise<TaskNotifications> {
  const now = new Date();
  const twoDaysFromNow = new Date(now);
  twoDaysFromNow.setDate(now.getDate() + 1);
  
  // Filter for overdue tasks (due date is before now and not completed)
  const overdue = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate < now && task.status !== 'COMPLETED';
  });
  
  // Filter for upcoming tasks (due date is between now and two days from now)
  const upcoming = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= now && dueDate <= twoDaysFromNow && task.status !== 'COMPLETED';
  });
  
  return {
    overdue,
    upcoming
  };
}
