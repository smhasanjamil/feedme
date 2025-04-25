"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
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

export default function ResetPasswordWithToken() {
  // Use the useParams hook instead
  const params = useParams();
  const token = params.token as string;

  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    
    if (!token) {
      toast.error("Reset token is missing");
      setIsLoading(false);
      return;
    }
    
    console.log("With token:", token);
    
    try {
      const resetData = {
        password: data.password,
        token: token
      };
      
      console.log("Sending reset data:", resetData);
      const response = await resetPassword(resetData);
      console.log("Reset password response:", response);

      if ("error" in response) {
        const errorResponse = response.error;
        console.error("Reset password error response:", errorResponse);
        
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
            toast.error("Failed to reset password");
          }
        } else if (errorResponse && "status" in errorResponse) {
          toast.error(`Server error: ${errorResponse.status}`);
        } else {
          toast.error("Failed to reset password");
        }
        setIsLoading(false);
        return;
      }

      if (response.data) {
        console.log("Reset password success response:", response.data);
        if (response.data.status) {
          toast.success(response.data.message || "Password has been reset successfully");
          setResetComplete(true);
        } else if (response.data.message) {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        toast.error(errorMessage);
      } else {
        toast.error("Failed to reset password");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to login after successful password reset
  useEffect(() => {
    if (resetComplete) {
      const redirectTimer = setTimeout(() => {
        router.push("/login");
      }, 3000);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [resetComplete, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="p-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              {resetComplete ? "Password Reset Complete" : "Reset Your Password"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {resetComplete 
                ? "You'll be redirected to the login page shortly" 
                : "Enter your new password below"}
            </p>
          </div>

          {!resetComplete ? (
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      className="block w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-base focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 focus:outline-none"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
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
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      className="block w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-base focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 focus:outline-none"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => 
                          value === watch("password") || "Passwords do not match"
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword.message}
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
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="rounded-md bg-[#FF0000] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#CC0000] focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:outline-none"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 