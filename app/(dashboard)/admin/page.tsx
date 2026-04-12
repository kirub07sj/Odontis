import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p>You do not have permission to view the Admin Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="px-4 py-2 bg-blue-600 text-white rounded-md shadow">
            Role: {session.user.role}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {session.user.name}!</h2>
          <p className="text-gray-600 dark:text-gray-300">
            This is your central administrative area. From here you can manage all users, system configurations, and view overarching analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg">Manage Users</h3>
            <p className="text-sm text-gray-500 mt-2">Create, update, and remove staff members across the system.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg">System Settings</h3>
            <p className="text-sm text-gray-500 mt-2">Configure operational hours, branches, and generic parameters.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg">Reports & Analytics</h3>
            <p className="text-sm text-gray-500 mt-2">View patient inflow, revenue, and system usage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
