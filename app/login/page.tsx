"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignInMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

type SignInFormData = {
  email: string;
  password: string;
};

type ErrorData = {
  message?: string;
  status?: boolean;
  error?: string;
};

export default function SignIn() {
  const [SignIn] = useSignInMutation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    const userData = {
      email: data.email,
      password: data.password,
    };
    try {
      const response = await SignIn(userData);

      if ("error" in response) {
        const errorResponse = response.error;
        if (errorResponse && "data" in errorResponse && errorResponse.data) {
          const errorData = errorResponse.data as ErrorData;
          toast.error(errorData.message || "Login failed. Please try again.");
        } else {
          toast.error("Login failed. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      if (response.data) {
        const { data: responseData } = response;
        if (responseData.status) {
          if (responseData.data?.token) {
            localStorage.setItem("token", responseData.data.token);
          }

          dispatch(setUser(responseData));
          toast.success(responseData.message || "Login successful", {
            duration: 1000,
          });
        } else {
          toast.error(responseData.message || "Login failed.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="my-8 grid w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-xl border-none shadow-md md:grid-cols-2">
        <div className="bg-velo-black/50">
          <div className="relative flex h-[150px] w-full items-center px-1 sm:h-[200px] md:h-[650px]">
            <h3 className="text-velo-white px-3 text-2xl font-bold md:px-6 md:pb-20 md:text-5xl md:leading-[70px] lg:text-6xl">
              Welcome
              <br />
              Back!
            </h3>
          </div>
        </div>

        <div className="flex w-full flex-col justify-center gap-4 p-5 md:gap-8 md:p-10">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Sign In
          </h1>
          <p className="text-gray-400 md:text-[17px]">
            Welcome Back! Please Sign In to your Account
          </p>
          <div className="w-full">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 md:space-y-7"
            >
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder="Enter your email address"
                  autoFocus
                  aria-invalid={!!errors.email}
                  className="border-velo-black/30 h-10 rounded-none border-0 border-b shadow-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none md:text-lg"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  aria-invalid={!!errors.password}
                  className="border-velo-black/30 h-10 rounded-none border-0 border-b shadow-none focus:outline-none focus-visible:ring-0 focus-visible:outline-none md:text-lg"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-velo-red text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="bg-velo-red hover:bg-velo-maroon h-11 w-full md:text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </div>

          <p className="text-muted-foreground text-center text-sm md:text-base">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-velo-red hover:text-velo-maroon font-semibold underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
