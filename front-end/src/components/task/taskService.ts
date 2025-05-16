"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";
// import { Task } from "../kanban/types/types";

/**
 * Fetch all tasks from the API
 * @returns Array of tasks
 */
export async function getAllTasks() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}` 
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error("Error fetching tasks:", res.statusText);
      throw new Error("Failed to fetch tasks");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getAllTasks:", error);
    throw error;
  }
}

/**
 * Fetch a task by ID
 * @param taskId The ID of the task to fetch
 * @returns Task object
 */
export async function getTaskById(taskId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    
    const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}` 
      },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error("Error fetching task:", res.statusText);
      throw new Error("Failed to fetch task");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getTaskById:", error);
    throw error;
  }
}

/**
 * Create a new task
 * @param taskData Task data object
 * @returns Created task
 */
export async function createTask(taskData: Omit<Task, 'id' | 'comments'>) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(taskData),
    });
    
    if (!res.ok) {
      console.error("Error creating task:", res.statusText);
      throw new Error("Failed to create task");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in createTask:", error);
    throw error;
  }
}
