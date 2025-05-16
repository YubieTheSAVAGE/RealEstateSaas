"use server";

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

/**
 * Fetch recent activity from the API
 * @param {number} limit - Maximum number of activities to return
 */
export async function getRecentActivity(limit = 5) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    
    const res = await fetch(`${API_URL}/api/activity/recent?limit=${limit}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}` 
      },
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!res.ok) {
      console.error("Error fetching activity:", res.statusText);
      throw new Error("Failed to fetch activity");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getRecentActivity:", error);
    throw error;
  }
}
