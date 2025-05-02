"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function addProject(formData: FormData)
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/projects`, {
            method: "POST",
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
            body: JSON.stringify({
                name: formData.get("name"),
                numberOfApartments: parseInt(formData.get("numberOfApartments") as string, 10),
                note: formData.get("note"),
            }),
        });

        if (!res.ok) {
            console.log("Error adding project:", res);
        }

        const data = await res.json();
        console.log("Project added successfully:", data);
    } finally
    {
    }
};