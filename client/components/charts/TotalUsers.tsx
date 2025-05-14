"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";

type UserRole = {
  role: "admin" | "provider" | "customer" | "user";
};

export function TotalUsers() {
  const { data, isLoading } = useGetAllUsersQuery();

  let adminCount = 0;
  let providerCount = 0;
  let customerCount = 0;

  if (data && data.length > 0) {
    data.forEach((user: UserRole) => {
      if (user.role === "admin") adminCount++;
      else if (user.role === "provider") providerCount++;
      else if (user.role === "customer") customerCount++;
    });
  }

  const chartData = [
    {
      browser: "admin",
      users: adminCount,
      fill: "var(--color-admin)",
    },
    {
      browser: "provider",
      users: providerCount,
      fill: "var(--color-provider)",
    },
    {
      browser: "customer",
      users: customerCount,
      fill: "var(--color-customer)",
    },
  ];

  const chartConfig = {
    users: {
      label: "Users",
    },
    admin: {
      label: "Admin",
      color: "hsl(var(--chart-1))",
    },
    provider: {
      label: "Provider",
      color: "hsl(var(--chart-2))",
    },
    customer: {
      label: "Customer",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.users, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>User Distribution by Role</CardTitle>
        <CardDescription>Distribution of registered users</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total registerd users
        </div>
      </CardFooter>
    </Card>
  );
}
