"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useState } from "react";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/redux/features/auth/authApi";

type ForgotPasswordFormData = {
  email: string;
};

type BackendErrorResponse = {
  message?: string;
  errorSources?: Array<{
    path?: string;
    message?: string;
  }>;
  success?: boolean;
  status?: boolean;
  error?: string;
};

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      console.log("Sending password reset request with email:", data.email);
      
      const response = await forgotPassword(data.email);
      console.log("Response:", response);

      if ("error" in response) {
        const errorResponse = response.error;
        if (errorResponse && "data" in errorResponse && errorResponse.data) {
          const errorData = errorResponse.data as BackendErrorResponse;
          
          // Check for error message in errorSources array
          if (errorData.errorSources && 
              Array.isArray(errorData.errorSources) && 
              errorData.errorSources.length > 0 && 
              errorData.errorSources[0].message) {
            toast.error(errorData.errorSources[0].message);
          } 
          // Fallback to general message if available
          else if (errorData.message) {
            toast.error(errorData.message);
          } else {
            toast.error("Failed to send reset link");
          }
        } else if (errorResponse && "status" in errorResponse) {
          toast.error(`Server error: ${errorResponse.status}`);
        } else {
          toast.error("Failed to send reset link");
        }
        setIsLoading(false);
        return;
      }

      if (response.data) {
        if (response.data.status) {
          toast.success(response.data.message || "Reset password link has been sent to your email");
          setRequestSent(true);
        } else if (response.data.message) {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        toast.error(errorMessage);
      } else {
        toast.error("Failed to send reset link");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="p-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              {requestSent ? "Check your email" : "Forgot Password"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {requestSent 
                ? "We've sent a password reset link to your email" 
                : "Enter your email address and we'll send you a link to reset your password"}
            </p>
          </div>

          {!requestSent ? (
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
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
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
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-6 flex justify-center">
              <Button
                className="rounded-md bg-[#FF0000] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#CC0000] focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:outline-none"
                onClick={() => setRequestSent(false)}
              >
                Send again
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-[#FF0000] hover:text-[#CC0000]"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 