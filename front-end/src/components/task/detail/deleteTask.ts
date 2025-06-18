"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";
import { Task } from "../kanban/types/types";

export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;

    const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: { 
        "Authorization": `Bearer ${token}` 
      },
    });
    console.log("Response from deleteTask:", res);
    if (!res.ok) {
      console.error("Error deleting task:", res.statusText);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in deleteTask:", error);
    return false;
  }
}