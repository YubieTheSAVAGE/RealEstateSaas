"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";


export default async function getClient()
{
    try {
        console.log("🚀 [Frontend] Starting client data fetch...");

        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;

        console.log("🔑 [Frontend] Token present:", !!token);
        console.log("🌐 [Frontend] API URL:", `${API_URL}/api/clients`);

        const startTime = Date.now();
        const res = await fetch(`${API_URL}/api/clients`, {
            method: "GET",
            headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}` }, // ✅ correct way to send JWT
        });

        const endTime = Date.now();
        console.log(`⏱️ [Frontend] Request took ${endTime - startTime}ms`);
        console.log("📊 [Frontend] Response status:", res.status, res.statusText);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ [Frontend] Error getting clients:", res.status, res.statusText);
            console.error("❌ [Frontend] Error response body:", errorText);
            return [];
        }

        const data = await res.json();

        // Detailed logging of client data
        console.log("✅ [Frontend] Clients fetched successfully");
        console.log("📊 [Frontend] Total clients count:", data.length);
        console.log("=" .repeat(80));
        console.log("📋 [Frontend] DETAILED CLIENT DATA:");
        console.log("=" .repeat(80));

        data.forEach((client, index) => {
            console.log(`\n👤 [Client ${index + 1}] ==========================================`);
            console.log(`   ID: ${client.id}`);
            console.log(`   First Name: ${client.firstName || 'N/A'}`);
            console.log(`   Last Name: ${client.lastName || 'N/A'}`);
            console.log(`   Full Name: ${client.name || 'N/A'}`);
            console.log(`   Email: ${client.email || 'N/A'}`);
            console.log(`   Phone: ${client.phoneNumber || 'N/A'}`);
            console.log(`   WhatsApp: ${client.whatsappNumber || 'N/A'}`);
            console.log(`   Status: ${client.status || 'N/A'}`);
            console.log(`   Provenance: ${client.provenance || 'N/A'}`);
            console.log(`   Notes: ${client.notes || 'N/A'}`);
            console.log(`   Created At: ${client.createdAt || 'N/A'}`);
            console.log(`   Updated At: ${client.updatedAt || 'N/A'}`);
            console.log(`   Created By ID: ${client.createdById || 'N/A'}`);
            console.log(`   User ID: ${client.userId || 'N/A'}`);

            // User account details (if linked)
            if (client.user) {
                console.log(`   🔐 User Account Details:`);
                console.log(`      User ID: ${client.user.id}`);
                console.log(`      User Name: ${client.user.name || 'N/A'}`);
                console.log(`      User Email: ${client.user.email || 'N/A'}`);
                console.log(`      User Role: ${client.user.role || 'N/A'}`);
                console.log(`      User Status: ${client.user.status || 'N/A'}`);
            } else {
                console.log(`   🔐 User Account: Not linked`);
            }

            // Interested apartments
            if (client.interestedApartments && client.interestedApartments.length > 0) {
                console.log(`   🏠 Interested Apartments (${client.interestedApartments.length}):`);
                client.interestedApartments.forEach((apt, aptIndex) => {
                    console.log(`      [${aptIndex + 1}] Apartment ID: ${apt.id}`);
                    console.log(`          Number: ${apt.number || 'N/A'}`);
                    console.log(`          Type: ${apt.type || 'N/A'}`);
                    console.log(`          Area: ${apt.area || 'N/A'}m²`);
                    console.log(`          Price: ${apt.price ? apt.price.toLocaleString() + '€' : 'N/A'}`);
                    console.log(`          Status: ${apt.status || 'N/A'}`);
                    if (apt.project) {
                        console.log(`          Project: ${apt.project.name} (ID: ${apt.project.id})`);
                    }
                });
            } else {
                console.log(`   🏠 Interested Apartments: None`);
            }

            // Reserved apartments
            if (client.apartments && client.apartments.length > 0) {
                console.log(`   🔒 Reserved Apartments (${client.apartments.length}):`);
                client.apartments.forEach((apt, aptIndex) => {
                    console.log(`      [${aptIndex + 1}] Apartment ID: ${apt.id}`);
                    console.log(`          Number: ${apt.number || 'N/A'}`);
                    console.log(`          Type: ${apt.type || 'N/A'}`);
                    console.log(`          Area: ${apt.area || 'N/A'}m²`);
                    console.log(`          Price: ${apt.price ? apt.price.toLocaleString() + '€' : 'N/A'}`);
                    console.log(`          Status: ${apt.status || 'N/A'}`);
                });
            } else {
                console.log(`   🔒 Reserved Apartments: None`);
            }

            console.log(`   ================================================`);
        });

        console.log("=" .repeat(80));
        console.log("📊 [Frontend] Client data summary:");
        console.log(`   Total clients: ${data.length}`);
        console.log(`   PROSPECT clients: ${data.filter(c => c.status === 'PROSPECT').length}`);
        console.log(`   CLIENT clients: ${data.filter(c => c.status === 'CLIENT').length}`);
        console.log(`   Clients with user accounts: ${data.filter(c => c.user).length}`);
        console.log(`   Clients with interested apartments: ${data.filter(c => c.interestedApartments && c.interestedApartments.length > 0).length}`);
        console.log(`   Clients with reserved apartments: ${data.filter(c => c.apartments && c.apartments.length > 0).length}`);
        console.log("=" .repeat(80));

        return data;
    } catch (error) {
        console.error("💥 [Frontend] Error in getClient:", error);
        console.error("💥 [Frontend] Error stack:", error.stack);
        return [];
    }
}
