"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function addClient(formData: FormData)
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/clients`, {
            method: "POST",
            headers: {"Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
            body: formData,
        });

        if (!res.ok) {
            console.log("Error adding client:", res);
        }
    } finally {
    }
};
