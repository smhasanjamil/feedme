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
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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

          router.push("/");
          router.refresh();
          setIsLoading(false);
        } else {
          toast.error(responseData.message || "Login failed.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative hidden bg-gradient-to-br from-[#FF0000] to-[#CC0000] md:block">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex h-full flex-col justify-center p-12">
              <h3 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                Welcome
                <br />
                Back!
              </h3>
              <p className="mt-4 text-lg text-white/90">
                Sign in to access your personalized meal plans and track your
                nutrition journey.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-8 py-12 sm:px-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#FF0000] transition-colors hover:text-[#CC0000]"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="block w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-base focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 focus:outline-none"
                      {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="block w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-base focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 focus:outline-none"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full rounded-md bg-[#FF0000] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#CC0000] focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
