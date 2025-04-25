"use client";

import UserManagementTable from "@/components/userManagement";

export default function ManageUsers() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <UserManagementTable />
    </div>
  );
} 