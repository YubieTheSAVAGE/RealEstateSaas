"use server";

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

export default async function addMonthlyTarget(formData: FormData) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/monthly-target`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
            body: JSON.stringify({
                target: formData.get("target"),
                startDate: formData.get("startDate"),
                endDate: formData.get("endDate"),
            }),
        });

        if (!res.ok) {
            // Error message translation
            console.log("Erreur lors de l'ajout de l'objectif mensuel:", res);
        }

        const data = await res.json();
        // Success message translation
        console.log("Objectif mensuel ajouté avec succès:", data);
    } finally {
    }
};