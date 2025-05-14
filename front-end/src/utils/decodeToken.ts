import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string | undefined) => {
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}; 