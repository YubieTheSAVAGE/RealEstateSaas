"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

interface UpdateClientData {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Optional for backward compatibility
  email?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  status?: "PROSPECT" | "CLIENT";
  notes?: string;
  provenance?: string;
  apartmentId?: string[];
  password?: string;
}

export default async function updateClient(clientData: UpdateClientData) {
  try {
    console.log("🚀 [Frontend] Starting client update request");
    console.log("📋 [Frontend] Client data:", { ...clientData, password: clientData.password ? "[REDACTED]" : undefined });

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;

    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log("🔑 [Frontend] Token present:", !!token);
    console.log("🌐 [Frontend] API URL:", `${API_URL}/api/clients/${clientData.id}`);

    const startTime = Date.now();
    const res = await fetch(`${API_URL}/api/clients/${clientData.id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(clientData),
    });

    const endTime = Date.now();
    console.log(`⏱️ [Frontend] Request took ${endTime - startTime}ms`);
    console.log("📊 [Frontend] Response status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ [Frontend] Error response body:", errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const responseData = await res.json();
    console.log("✅ [Frontend] Success response:", responseData);
    return responseData;

  } catch (error) {
    console.error("💥 [Frontend] Client update failed:", error);
    throw error;
  }
};