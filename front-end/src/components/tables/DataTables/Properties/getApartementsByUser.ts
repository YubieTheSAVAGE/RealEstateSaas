"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

export default async function getApartementsByUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/apartments/user`, {
            method: "GET",
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
        });
        if (!res.ok) {
            console.log("Error getting apartments:", res);
        }
        const data = await res.json();
        // console.log("Apartments data:", data);
        return data;
    } finally
    {
    }
}
