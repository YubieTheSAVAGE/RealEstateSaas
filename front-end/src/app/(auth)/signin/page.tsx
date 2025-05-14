import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Immo360 | Sign In",
  description: "This is Immo360 Sign In Page",
};

export default function SignIn() {
  return <SignInForm />;
}
