"use server"
import { jwtDecode } from "jwt-decode"

import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

export async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
  
  console.log('Cookie store:', cookieStore);
  console.log('Token:', token);

  if (!token) {
    console.log('No token found');
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    console.log('Decoded token:', decodedToken);
    return decodedToken;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
