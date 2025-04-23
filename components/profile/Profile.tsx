"use client";

import { currentUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Ban, Edit, LocateIcon, Mail, Phone, Shield, User } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const Profile = () => {
  const userFromStore = useAppSelector(currentUser);
  const [user, setUser] = useState<typeof userFromStore | null>(null);

  // Only set user after the component mounts on the client
  useEffect(() => {
    setUser(userFromStore);
  }, [userFromStore]);

  // If the user is not yet available (i.e. during hydration), return null or a loader
  if (!user) {
    return (
      <div className="text-muted-foreground p-6 text-center">
        Loading profile...
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {/* Header info */}
      <Card className="w-full">
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-800 text-3xl font-semibold text-white">
              {user?.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-muted-foreground">{user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* User info */}
      <Card className="w-full">
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold">User Information</h3>
            <Button className="rounded-full bg-red-600">
              <Edit /> Edit
            </Button>
          </div>
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
            <div className="w-full md:w-1/2">
              <div className="flex flex-row gap-2 py-4">
                <div>
                  <User size={20} className="text-muted-foreground pt-1" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground text-md">Name</div>
                  <div>{user?.name}</div>
                </div>
              </div>
              <div className="flex flex-row gap-2 py-4">
                <div>
                  <Mail size={20} className="text-muted-foreground pt-1" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground text-md">Email</div>
                  <div>{user?.email}</div>
                </div>
              </div>
              <div className="flex flex-row gap-2 py-4">
                <div>
                  <Shield size={20} className="text-muted-foreground pt-1" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground text-md">Role</div>
                  <div>{user?.role}</div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col justify-center md:w-1/2">
              <div className="flex flex-row gap-2 pb-4 md:py-4">
                <div>
                  <Phone size={20} className="text-muted-foreground pt-1" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground text-md">
                    Phone Number
                  </div>
                  <div>0178965666666</div>
                </div>
              </div>
              <div className="flex flex-row gap-2 py-4">
                <div>
                  <LocateIcon
                    size={20}
                    className="text-muted-foreground pt-1"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground text-md">Address</div>
                  <div>Khulna, Bangladesh</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Account Status */}
      <Card className="w-full">
        <CardContent>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Account Status</h3>
          </div>
          <div className="flex flex-row gap-2 py-4">
            <div>
              <Ban size={20} className="text-muted-foreground pt-1" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground text-md">Block Status</div>
              <div>{user?.isBlocked ? "Inactive" : "Active"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Password Change */}
      <Card className="w-full">
        <CardContent>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">Change Password</h3>
          </div>
          <form>
            <div className="py-4">
              <div className="py-2">
                <Label htmlFor="currentPassword" className="pb-2">
                  Current Password
                </Label>
                <Input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  placeholder="Enter Current Password"
                  autoComplete="current-password"
                />
              </div>
              <div className="py-2">
                <Label htmlFor="newPassword" className="pb-2">
                  New Password
                </Label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="Enter New Password"
                  autoComplete="new-password"
                />
              </div>
              <div className="py-2">
                <Label htmlFor="confirmPassword" className="pb-2">
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  autoComplete="new-password"
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
