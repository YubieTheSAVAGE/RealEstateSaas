"use server"
import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

export default async function getClientById(id: string) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;

        const res = await fetch(`${API_URL}/api/clients/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const data = await res.json();
        if (!data) {
            return null;
        }
        return data;
    } finally {
    }
};
