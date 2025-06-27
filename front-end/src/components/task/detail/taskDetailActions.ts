"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";
import { Task } from "../kanban/types/types";

/**
 * Update a task via API
 * @param task The updated task data
 */
export async function updateTask(task: Task) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    
    const res = await fetch(`${API_URL}/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status
      }),
    });
    
    if (!res.ok) {
      console.error("Error updating task:", res.statusText);
      throw new Error("Failed to update task");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw error;
  }
}

/**
 * Add a comment to a task
 * @param taskId The ID of the task to add a comment to
 * @param content The comment content
 */
export async function addComment(taskId: string, content: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    
    const res = await fetch(`${API_URL}/api/tasks/${taskId}/comments`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ comment: content }),
    });
    
    if (!res.ok) {
      console.error("Error adding comment:", res.statusText);
      throw new Error("Failed to add comment");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in addComment:", error);
    throw error;
  }
}

/**
 * Get comments for a task
 * @param taskId The ID of the task to get comments for
 */
export async function getTaskComments(taskId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    
    const res = await fetch(`${API_URL}/api/tasks/${taskId}/comments`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}` 
      },
    });
    
    if (!res.ok) {
      console.error("Error getting task comments:", res.statusText);
    //   throw new Error("Failed to get task comments");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getTaskComments:", error);
    throw error;
  }
}
