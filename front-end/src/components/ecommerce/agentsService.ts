"use server";

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

/**
 * Fetch top performing agents from the API
 * @param {number} limit - Maximum number of agents to return
 */
export async function getTopPerformingAgents(limit = 5) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    
    const res = await fetch(`${API_URL}/api/agents/top-performing?limit=${limit}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",  
        "Authorization": `Bearer ${token}` 
      },
      cache: 'no-store',
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!res.ok) {
      console.error("Error fetching top agents:", res.statusText);
      throw new Error("Failed to fetch top performing agents");
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in getTopPerformingAgents:", error);
    throw error;
  }
}
