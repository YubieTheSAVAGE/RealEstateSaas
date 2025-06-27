import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immo360 | Connexion",
  description: "Ceci est la page de connexion Immo360",
};

export default function SignIn() {
  return <SignInForm />;
}