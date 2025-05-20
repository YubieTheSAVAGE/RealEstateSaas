"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function addAgents(formData: FormData)
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/agents`, {
            method: "POST",
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
            body: JSON.stringify({
                name: formData.get("name"),
                email: formData.get("email"),
                phoneNumber: formData.get("phoneNumber"),
                status: formData.get("status"),
                notes: formData.get("notes"),
                role: formData.get("role"),
                password: formData.get("password"), // Will be hashed on the server
            }),
        });

        if (!res.ok) {
            console.log("Error adding agent:", res);
        }

        const data = await res.json();
        console.log("Agent added successfully:", data);
    } finally
    {
    }
};