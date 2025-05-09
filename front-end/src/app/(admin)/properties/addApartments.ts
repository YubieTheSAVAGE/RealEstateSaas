"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function addApartments(formData: FormData)
{
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
        const res = await fetch(`${API_URL}/api/projects/${formData.get("id")}/apartments`, {
            method: "POST",
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
            body: JSON.stringify({
                number: parseInt(formData.get("number") as string, 10),
                floor: parseInt(formData.get("floor") as string, 10),
                type: formData.get("type"),
                area: parseInt(formData.get("area") as string, 10),
                threeDViewUrl: formData.get("threeDViewUrl"),
                price: parseInt(formData.get("price") as string, 10),
                status: formData.get("status"),
                notes: formData.get("notes"),
                pricePerM2: parseInt(formData.get("pricePerM2") as string, 10),
                zone: formData.get("zone"),
            }),
        });

        if (!res.ok) {
            console.log("Error adding project:", res);
        }

        const data = await res.json();
        console.log("Project added successfully:", data);
    } finally {
    }
};