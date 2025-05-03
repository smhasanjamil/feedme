"use client";

import UserManagementTable from "@/components/userManagement";

export default function ManageUsers() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Manage Users</h1>
      <UserManagementTable />
    </div>
  );
}
