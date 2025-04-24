"use client";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Ban,
  Edit,
  LocateIcon,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";
import {
  useChangePasswordMutation,
  useGetUserByIdQuery,
  useUpdateSingleUserMutation,
} from "@/redux/features/user/userApi";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { passwordSchema } from "./passwordChangeValidation";

type ErrorResponse = {
  data?: {
    message?: string;
  };
};

const Profile = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [changePassword, { isLoading: isUpdatingPassword }] =
    useChangePasswordMutation();

  const idFromStore = useAppSelector(currentUser);
  const userId = idFromStore?.id as string;

  const {
    data: user,
    isLoading,
    refetch,
  } = useGetUserByIdQuery(userId as string);

  const [updateUser] = useUpdateSingleUserMutation();

  // Handle Profile Update
  const handleProfileUpdate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const address = (form.elements.namedItem("address") as HTMLInputElement)
      .value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    // const data = { name, email,password };

    const updatePayload = {
      _id: userId,
      name,
      email,
      phone,
      address,
      password,
    };

    try {
      const res = await updateUser(updatePayload).unwrap();
      if (res.status) {
        console.log(res);
        toast.success(res.message);
        refetch();
        setIsDialogOpen(false);
      }
    } catch (err) {
      const errorMessage =
        (err as ErrorResponse)?.data?.message || "Failed to update profile.";
      toast.error(errorMessage);
    }
  };

  // Update password
  const form = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const newPassword = form.watch("newPassword");
  const passwordConfirm = form.watch("passwordConfirm");

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const { currentPassword, newPassword } = data;

    try {
      const res = await changePassword({
        userId,
        currentPassword,
        newPassword,
      }).unwrap();

      toast.success(res.message || "Password updated successfully!");
      form.reset({
        currentPassword: "",
        newPassword: "",
        passwordConfirm: "",
      });
    } catch (err) {
      const error = err as ErrorResponse;
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  if (isLoading) {
    return <p className="text-blue-500">Loading profile...</p>;
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
            {/* <Button className="rounded-full bg-red-600">
              <Edit /> Edit
            </Button> */}

            {/* Dialog start here */}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-red-500 hover:bg-red-600">
                  <Edit /> Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&#39;re done.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        type="text"
                        id="name"
                        defaultValue={user?.name}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        defaultValue={user?.email}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Phone
                      </Label>
                      <Input
                        type="text"
                        id="phone"
                        defaultValue={user?.phone}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="address" className="text-right">
                        Address
                      </Label>
                      <Input
                        type="text"
                        id="address"
                        defaultValue={user?.address}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <Input
                        type="password"
                        id="password"
                        placeholder="Enter your current password"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Dialog end here */}
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
                  <div>{user?.phone}</div>
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
                  <div>{user?.address}</div>
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter Your Current Password"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter Your New Password"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your Password"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      {passwordConfirm && newPassword !== passwordConfirm ? (
                        <FormMessage> Password does not match </FormMessage>
                      ) : (
                        <FormMessage />
                      )}
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-fit bg-red-500 hover:bg-red-600"
                  disabled={isSubmitting || isUpdatingPassword}
                >
                  <Lock />
                  {isSubmitting || isUpdatingPassword
                    ? "Updating..."
                    : "Update Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
