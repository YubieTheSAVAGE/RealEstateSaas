"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FormResponse } from "@/app/common/interfaces/form-response.interface";
import { API_URL } from "@/app/common/constants/api";
import { getErrorMessage } from "@/app/common/utils/errors";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

export default async function login(_prevState: FormResponse, formData: FormData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('Login attempt:', { email, password });

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    console.log('Making API request to:', `${API_URL}/auth/login`);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    console.log('API Response status:', res.status);
    const parsedRes = await res.json();
    console.log('API Response:', parsedRes);

    if (!res.ok) {
      return { error: getErrorMessage(parsedRes) };
    }
    await setAuthCookie(parsedRes);
    return { success: true, redirect: '/home' };
  } catch (error) {
    console.error('Login error details:', error);
    return { error: error instanceof Error ? error.message : 'An unexpected error occurred during login' };
  }
}

const setAuthCookie = async (response: { token: string }) => {
  const token = response.token;
  const cookieStore = await cookies();
  cookieStore.set({
    name: AUTHENTICATION_COOKIE,
    value: token,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    expires: new Date(jwtDecode(token).exp! * 1000), // Convert to milliseconds
  });
  // const userRole = getUserRoleFromToken(token);
  // redirect("/");
};

type DecodedToken = {
  role?: string;
  [key: string]: any;
};

export const getUserRoleFromToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    if (!token) {
      return null;
    }
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}