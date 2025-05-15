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
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
            body: JSON.stringify({
                name: formData.get("name"),
                email: formData.get("email"),
                phoneNumber: formData.get("phoneNumber"),
                status: formData.get("status"),
                notes: formData.get("notes"),
                provenance: formData.get("provenance"),
            }),
        });

        if (!res.ok) {
            console.log("Error adding client:", res);
        }

        const data = await res.json();
        console.log(formData.get("apartmentId"), data.id);
        const assignRequest = await fetch(`${API_URL}/api/apartments/${formData.get("apartmentId")}/assign`, {
            method: "POST",
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
            body: JSON.stringify({
                clientId: data.id,
            }),
        });
        console.log("Assign request response:", assignRequest);

        console.log("Client added successfully:", data);
    } finally {
    }
};
