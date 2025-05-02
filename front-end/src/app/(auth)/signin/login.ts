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
    return { success: true, redirect: '/' };
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
    secure: true,
    httpOnly: true,
    expires: new Date(jwtDecode(token).exp! * 1000),
  });
  // const userRole = getUserRoleFromToken(token);
  // redirect("/");
};