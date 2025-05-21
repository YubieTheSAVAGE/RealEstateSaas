"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function getMonthlyTarget() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/monthly-target`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (!res.ok) {
            console.log("Error fetching monthly target:", res);
        }

        const data = await res.json();
        return data;
    } finally {
    }
};