"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function editApartements(formData: FormData)
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        // Use FormData directly to properly upload the image file
        const res = await fetch(`${API_URL}/api/apartments/${formData.get("id")}`, {
            method: "PUT",
            headers: {
            "Authorization": `Bearer ${token}`
            },
            body: formData,
        });

        if (!res.ok) {
            console.log("Error editing project:", res);
        }

        const data = await res.json();
        console.log("Project added successfully:", data);
    } finally
    {
    }
};