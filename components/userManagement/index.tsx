"use client";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function UserManagementTable() {
  //   const data = await getData()

  const { data, isLoading, isError } = useGetAllUsersQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data. Please try again later.</div>;
  }

  const filteredData =
    data?.map((user) => ({
      name: user.name,

      _id: user._id,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
    })) || [];


  return (
    <div>
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
}
