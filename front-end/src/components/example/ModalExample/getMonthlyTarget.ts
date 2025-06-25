"use server";

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

export default async function getMonthlyTarget() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/monthly-target`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",  
                "Authorization": `Bearer ${token}` 
            },
            cache: "no-store" // Ensure we get fresh data
        });
        
        if (!res.ok) {
            console.error("Error fetching monthly target data:", res.status);
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching monthly target data:", error);
        return null;
    }
};