"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function deleteAgents(agentId: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/agents/${agentId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
        });

        if (!res.ok) {
            console.log("Error deleting agent:", res);
            return false; // Return false if the deletion failed
        }
        return true;
    } finally
    {
    }
}
