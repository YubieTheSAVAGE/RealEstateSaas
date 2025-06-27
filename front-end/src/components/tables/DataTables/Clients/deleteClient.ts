"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function deleteProperties(projectId: string): Promise<boolean>
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/clients/${projectId}`, {
            method: "DELETE",
            body: JSON.stringify({ id: parseInt(projectId as string, 10) }), // Send the project ID in the request body
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
        });
        if (!res.ok) {
            console.log("Error deleting Client:", res);
            return false; // Return false if the deletion failed
        } else {
            console.log("Client deleted successfully:", res);
            return true; // Return true if the deletion was successful
        }
    } finally
    {
    }
}
