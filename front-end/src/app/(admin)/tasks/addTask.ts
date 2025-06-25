"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function addTask(formData: FormData)
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/tasks`, {
            method: "POST",
            headers: {
            "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        if (!res.ok) {
            console.error("Error adding task:", res);
            return null;
        }

        const data = await res.json();
        console.log("Task added successfully:", data);
        return data; // Return the newly created task
    } catch (error) {
        console.error("Error in addTask:", error);
        return null;
    }
};