"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function changeTaskStatuss(taskId: string, newStatus: string)
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/tasks/${taskId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
            body: JSON.stringify({ status: newStatus }),
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
