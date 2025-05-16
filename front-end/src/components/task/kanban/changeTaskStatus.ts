"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function changeTaskStatuss(taskId: string, newStatus: string)
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        
        // Ensure status is one of the valid enums accepted by the backend
        const validStatus = ["TODO", "IN_PROGRESS", "COMPLETED"].includes(newStatus) 
            ? newStatus 
            : "TODO";
            
        const res = await fetch(`${API_URL}/api/tasks/${taskId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ status: validStatus }),
        });
        if (!res.ok) {
            console.log("Error getting tasks:", res);
        }
        const data = await res.json();
        return data;
    } finally
    {
    }
}
