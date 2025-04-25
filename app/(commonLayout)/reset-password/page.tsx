"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { CheckCircle } from "lucide-react";

type ResetPasswordFormData = {
  email: string;
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

// Loading component for Suspense
function ResetPasswordLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl p-8">
        <div className="text-center">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Loading...
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component that uses useSearchParams
function ResetPasswordContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [resetPassword] = useResetPasswordMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ResetPasswordFormData>();

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    
    if (!token) {
      toast.error("Reset token is missing");
      setIsLoading(false);
      return;
    }
    
    console.log("Resetting password for email:", data.email);
    console.log("With token:", token);
    
    try {
      const resetData = {
        email: data.email,
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

  // Handle invalid or missing token
  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl p-8">
          <div className="text-center">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 mb-4">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 mb-6">
              The password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="rounded-md bg-[#FF0000] px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#CC0000] focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:outline-none"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      type="email"
                      readOnly
                      className="block w-full rounded-md border border-gray-200 bg-gray-100 px-4 py-3 text-base focus:border-[#FF0000] focus:ring-2 focus:ring-[#FF0000]/20 focus:outline-none"
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                </div>

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
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md bg-[#FF0000] px-4 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#CC0000] focus:ring-2 focus:ring-[#FF0000] focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Processing..." : "Reset Password"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully. You will be redirected to the login page.
              </p>
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

// Export the component with Suspense boundary
export default function ResetPassword() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
} 