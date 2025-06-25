"use server"

import { API_URL } from "@/app/common/constants/api";
import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export default async function getTasksByUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;

        if (!token) {
            console.error("No authentication token found");
            return [];
        }

        // Extract user ID from the token
        let userId: number;
        try {
            const decodedToken = jwt.decode(token) as JwtPayload;
            userId = decodedToken.id;
            
            if (!userId) {
                console.error("User ID not found in token");
                return [];
            }
        } catch (error) {
            console.error("Failed to decode token:", error);
            return [];
        }

        // Fetch tasks for the user
        const res = await fetch(`${API_URL}/api/tasks/user/${userId}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",  
                "Authorization": `Bearer ${token}` 
            },
            cache: "no-store" // Ensure we get fresh data each time
        });
        
        if (!res.ok) {
            console.error("Error getting tasks:", res.status);
            return [];
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}