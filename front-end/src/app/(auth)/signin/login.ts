"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { FormResponse } from "@/app/common/interfaces/form-response.interface";
import { API_URL } from "@/app/common/constants/api";
import { getErrorMessage } from "@/app/common/utils/errors";
import { AUTHENTICATION_COOKIE } from "@/app/(auth)/auth-cookie";

export default async function login(_prevState: FormResponse, formData: FormData) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    console.log('Tentative de connexion :', { email, password });

    if (!email || !password) {
      return { error: 'Email et mot de passe requis' };
    }

    console.log('Envoi de la requête API à :', `${API_URL}/auth/login`);
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    
    console.log('Statut de la réponse API :', res.status);
    const parsedRes = await res.json();
    console.log('Réponse API :', parsedRes);

    if (!res.ok) {
      return { error: getErrorMessage(parsedRes) };
    }
    await setAuthCookie(parsedRes);
    return { success: true, redirect: '/home' };
  } catch (error) {
    console.error('Détails de l’erreur de connexion :', error);
    return { error: error instanceof Error ? error.message : 'Une erreur inattendue est survenue lors de la connexion' };
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
    expires: new Date(jwtDecode(token).exp! * 1000), // Convertir en millisecondes
  });
  // const userRole = getUserRoleFromToken(token);
  // redirect("/");
};

type DecodedToken = {
  role?: string;
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: string | number | boolean | undefined;
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
    console.error("Erreur lors du décodage du token :", error);
    return null;
  }
}

export const getUserIdFromToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTHENTICATION_COOKIE)?.value;
    if (!token) {
      return null;
    }
    const decodedToken = jwtDecode<DecodedToken>(token);
    return decodedToken.id;
  } catch (error) {
    console.error("Erreur lors du décodage du token :", error);
    return null;
  }
};