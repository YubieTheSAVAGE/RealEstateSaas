"use server";

import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";
import { redirect } from "next/navigation";

export default async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(AUTHENTICATION_COOKIE);
    redirect("/auth/signin");
}