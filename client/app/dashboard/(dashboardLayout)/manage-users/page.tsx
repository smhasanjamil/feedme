import UserManagementTable from "@/components/userManagement";

const page = () => {
  return (
    <div className="container mx-auto px-10 py-2">
      <h3 className="text-2xl font-bold">User Management</h3>
      <UserManagementTable />
    </div>
  );
};

export default page;
