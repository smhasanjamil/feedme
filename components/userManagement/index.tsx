import { columns, DashboardUserData } from "./columns"
import { DataTable } from "./data-table"


async function getData(): Promise<DashboardUserData[]> {
  // Fetch data from your API here.
  return [
    {
        name: "Hasan",
        _id: "68078498b84b041d6297fa01",
        email: "hasan@gmail.com",
        role: "user",
        isBlocked: false,
      },
      {
        name: "Jamil",
        _id: "68078498b84b041d6297fa02",
        email: "jamil@gmail.com",
        role: "user",
        isBlocked: false,
      },
      {
        name: "Rafiq",
        _id: "68078498b84b041d6297fa03",
        email: "rafiq@gmail.com",
        role: "admin",
        isBlocked: false,
      },
      {
        name: "Karim",
        _id: "68078498b84b041d6297fa04",
        email: "karim@gmail.com",
        role: "user",
        isBlocked: true,
      },
      {
        name: "Nasir",
        _id: "68078498b84b041d6297fa05",
        email: "nasir@gmail.com",
        role: "user",
        isBlocked: false,
      },
      {
        name: "Sabbir",
        _id: "68078498b84b041d6297fa06",
        email: "sabbir@gmail.com",
        role: "admin",
        isBlocked: false,
      },
      {
        name: "Tariq",
        _id: "68078498b84b041d6297fa07",
        email: "tariq@gmail.com",
        role: "user",
        isBlocked: false,
      },
      {
        name: "Mahmud",
        _id: "68078498b84b041d6297fa08",
        email: "mahmud@gmail.com",
        role: "user",
        isBlocked: true,
      },
      {
        name: "Nayeem",
        _id: "68078498b84b041d6297fa09",
        email: "nayeem@gmail.com",
        role: "admin",
        isBlocked: false,
      },
      {
        name: "Shakib",
        _id: "68078498b84b041d6297fa0a",
        email: "shakib@gmail.com",
        role: "user",
        isBlocked: false,
      },
      {
        name: "Ehsan",
        _id: "68078498b84b041d6297fa0b",
        email: "ehsan@gmail.com",
        role: "user",
        isBlocked: false,
      },
      {
        name: "Mamun",
        _id: "68078498b84b041d6297fa0c",
        email: "mamun@gmail.com",
        role: "admin",
        isBlocked: true,
      },
    // ...
  ]
}

export default async function UserManagementTable() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
