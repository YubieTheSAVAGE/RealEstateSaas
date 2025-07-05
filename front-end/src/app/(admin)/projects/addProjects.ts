"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

export default async function addProject(formData: FormData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        
        if (!token) {
            throw new Error("Authentication token not found");
        }

        // Use FormData directly to properly upload the image file
        const res = await fetch(`${API_URL}/api/projects`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        if (!res.ok) {
            console.log("Error adding project:", res);
            const errorData = await res.json().catch(() => ({ error: "Unknown error occurred" }));
            return { error: errorData.error || `HTTP error! status: ${res.status}` };
        }

        const data = await res.json();
        console.log("Project added successfully:", data);
        return data;
    } catch (error) {
        console.error("Error adding project:", error);
        return { error: error instanceof Error ? error.message : "Unknown error occurred" };
    }
}