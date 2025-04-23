"use client";
import React from "react";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/user/userApi";
import { DataTable } from "./data-table";
import { DashboardUserData, getColumns } from "./columns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

export default function UserManagementTable() {
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const { data, isLoading } = useGetAllUsersQuery();

  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] =
    React.useState<DashboardUserData | null>(null);

  const handleUpdateUser = (user: DashboardUserData) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filteredData =
    data?.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    })) || [];

  // Handeling user update
  const handleUserUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const role = (form.elements.namedItem("role") as HTMLInputElement).value;

    const validRoles: DashboardUserData["role"][] = [
      "user",
      "admin",
      "provider",
 
    ];
    const isValidRole = validRoles.includes(role as DashboardUserData["role"]);
    if (!isValidRole) {
      console.error("Invalid role");
      return;
    }

    const isBlockedString = (
      form.elements.namedItem("isBlocked") as HTMLInputElement
    ).value
      .trim()
      .toLowerCase();

    const isBlocked = isBlockedString === "inactive"; // Convert string to boolean

    const id = selectedUser?._id;
    if (!id) return;

    const updatedData = {
      name,
      role: role as DashboardUserData["role"],
      isBlocked,
      id,
    };

    try {
      // Perform the mutation
      const result = await updateUser({ id, data: updatedData }).unwrap();

      console.log("User updated successfully", result);
      setOpenDialog(false); // close dialog after update
      if (result?.message) {
        toast.success(result.message);
      }
    } catch (error: any) {
      // Log the error object in detail but suppress Next.js default error logging
      toast.error(
        error?.data?.message || error?.message || "Something went wrong",
      );
    }
  };

  // Handle delete
  const handleDeleteUser = async (id: string) => {
    try {
      const result = await deleteUser(id).unwrap(); // Use delete mutation
      toast.success(result.message); // Show success toast
    } catch (error: any) {
      toast.error(error); // Show error toast
    }
  };

  return (
    <div>
      <DataTable
        columns={getColumns(handleUpdateUser, handleDeleteUser)}
        data={filteredData}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>
              Make changes to user profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleUserUpdate}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedUser.name}
                    className="col-span-3"
                  />
                </div>

                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <select
                    id="role"
                    name="role"
                    defaultValue={selectedUser?.role}
                    className="col-span-3 rounded border px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="provider">Provider</option>
                  </select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
  <Label htmlFor="isBlocked" className="text-right">
    Status
  </Label>
  <select
    id="isBlocked"
    name="isBlocked"
    defaultValue={selectedUser.isBlocked ? "inactive" : "active"}
    className="col-span-3 rounded border px-2 py-1"
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>
</div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
