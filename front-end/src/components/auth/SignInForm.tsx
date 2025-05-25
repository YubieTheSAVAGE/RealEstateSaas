"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useTransition } from "react";
import login from "@/app/(auth)/signin/login";
import { useActionState } from "react";
import SigninSpinner from "../ui/spinners/SigninSpinner";

type FormState = { 
  error: string; 
  success?: boolean; 
  redirect?: string;
};
type FormPayload = FormData;

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState<FormState, FormPayload>(
    async (state, payload) => {
      try {
        const result = await login(state, payload);
        return { ...result, error: result.error || '' };
      } catch (error) {
        console.error("Login error:", error);
        return { error: "An error occurred during login" };
      }
    },
    { error: "" }
  );

  useEffect(() => {
    if (state?.success && state?.redirect) {
      router.push(state.redirect);
    }
  }, [state, router]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = () => {
    startTransition(() => {
    });
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form action={formAction} onSubmit={handleSubmit}>
              {state?.error && (
                <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-lg">
                  {state.error}
                </div>
              )}
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    name="email" 
                    type="email"
                    required
                    placeholder="info@gmail.com" 
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  {isPending ? (
                    <SigninSpinner />
                  ) : (
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isPending}
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}