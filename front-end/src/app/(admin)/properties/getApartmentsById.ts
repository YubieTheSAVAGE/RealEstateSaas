"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";
import { Property } from "@/types/property";


export default async function getApartmentsById(id: string)
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        // Use FormData directly to properly upload the image file
        const res = await fetch(`${API_URL}/api/apartments/${id}`, {
            method: "GET",
            headers: {
            "Authorization": `Bearer ${token}`
            },
        });

        if (!res.ok) {
            console.log("Error editing project:", res);
        }

        const data: Property = await res.json();
        return data;
    } finally
    {
    }
};