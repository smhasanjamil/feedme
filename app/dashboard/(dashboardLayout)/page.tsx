"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { currentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { Sparkles } from "lucide-react";

export default function Page() {
  const user = useAppSelector(currentUser);
  console.log(user);
  return (
    <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2 rounded-2xl bg-gradient-to-br from-green-50 to-white p-6 shadow">
        <CardContent className="space-y-4">
          {user?.name ? (
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, <span className="text-green-600">{user.name}</span> 🌱
            </h1>
          ) : null}
          <p className="text-gray-600">
            Your meal plan is tailored to your lifestyle and preferences.
          </p>
        </CardContent>
      </Card>
      <Card className="rounded-2xl bg-gradient-to-br from-yellow-50 to-white p-4 shadow">
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="border-yellow-300 text-yellow-700"
            >
              Health Tip
            </Badge>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          <blockquote className="text-sm text-gray-700 italic">
            &quot;A healthy outside starts from the inside. Fuel your body with
            clean, balanced meals.&quot;
          </blockquote>
        </CardContent>
      </Card>
    </div>
  );
}
