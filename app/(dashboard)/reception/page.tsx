import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ReceptionDashboardPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "RECEPTIONIST") {
    return (
      <div className="p-8 text-center text-red-500">
        <h1 className="text-2xl font-bold">Unauthorized</h1>
        <p>You do not have permission to view the Reception Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reception Dashboard</h1>
          <div className="px-4 py-2 bg-purple-600 text-white rounded-md shadow">
            Role: {session.user.role}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Welcome, {session.user.name}!</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Manage front-desk operations, appointments, incoming patients, and general inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition border-l-4 border-purple-500">
            <h3 className="font-bold text-lg">Register New Patient</h3>
            <p className="text-sm text-gray-500 mt-2">Quickly onboard new patients into the system.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg">Daily Schedule</h3>
            <p className="text-sm text-gray-500 mt-2">View all doctor schedules for the given day.</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="font-bold text-lg">Billing & Payments</h3>
            <p className="text-sm text-gray-500 mt-2">Manage invoices, collect payments, and print receipts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
