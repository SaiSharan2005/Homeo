import React, { useState } from "react";
import {
  Users,
  CalendarCheck,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data for the Visitors Statistics chart
const visitorsData = [
  { name: "Jan", visitors: 400 },
  { name: "Feb", visitors: 300 },
  { name: "Mar", visitors: 450 },
  { name: "Apr", visitors: 700 },
  { name: "May", visitors: 650 },
  { name: "Jun", visitors: 800 },
  { name: "Jul", visitors: 750 },
];

const DashboardMain = () => {
  // Dropdown state for visitors chart range
  const [range, setRange] = useState("This Month");

  return (
    <div className="relative w-full min-h-screen bg-gray-50">
      {/* Curved background at the top */}
      {/* <div className="absolute top-0 left-0 right-0 h-64 bg-blue-100 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L60,85.3C120,107,240,149,360,160C480,171,600,149,720,165.3C840,181,960,235,1080,240C1200,245,1320,203,1380,181.3L1440,160L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>
      </div> */}

      {/* Main Content Container */}
      <div className="relative z-10 p-6 lg:p-8">
        {/* Welcome Section */}
        <div className="mb-6">
          {/* <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
            Welcome back, Richard
          </h1> */}
          <p className="text-sm text-gray-600">
            Track, manage and secure your patient reports and data.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Patients Card */}
          <div className="bg-white shadow-sm rounded-xl p-5">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-600 rounded-full p-2 mr-3">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-gray-700 font-semibold text-sm">
                Total Patients
              </h2>
              <button className="ml-auto text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">2,420</div>
            <p className="text-xs text-green-500">+7.2% from last month</p>
          </div>

          {/* New Appointments Card */}
          <div className="bg-white shadow-sm rounded-xl p-5">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 text-green-600 rounded-full p-2 mr-3">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h2 className="text-gray-700 font-semibold text-sm">
                New Appointments
              </h2>
              <button className="ml-auto text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">226</div>
            <p className="text-xs text-green-500">+15.4% from last month</p>
          </div>

          {/* Pending Reports Card */}
          <div className="bg-white shadow-sm rounded-xl p-5">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 text-yellow-600 rounded-full p-2 mr-3">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-gray-700 font-semibold text-sm">
                Pending Reports
              </h2>
              <button className="ml-auto text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">193</div>
            <p className="text-xs text-red-500">-3.8% from last month</p>
          </div>
        </div>
      {/* </div> */}
        {/* Visitors Statistics (Full-width) */}
        <div className="bg-white shadow-sm rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Visitors Statistics
              </h3>
              <p className="text-sm text-gray-500">
                Total Patients <span className="font-semibold">2,345</span>
              </p>
            </div>
            {/* Dropdown for range */}
            <select
              className="text-sm border border-gray-300 rounded p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option>This Month</option>
              <option>Last 5 Months</option>
              <option>All Data</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visitorsData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#718096" />
                <YAxis stroke="#718096" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#3182CE"
                  strokeWidth={3}
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Patient Appointments Table */}
        <div className="bg-white shadow-sm rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Patient Appointments
            </h3>
            <button className="text-blue-600 text-sm hover:underline">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-600 text-sm border-b">
                  <th className="py-2 px-3">Patient Name</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">John Doe</td>
                  <td className="py-2 px-3 text-green-500 font-medium">
                    Confirmed
                  </td>
                  <td className="py-2 px-3">10:00 AM</td>
                  <td className="py-2 px-3">2025-03-01</td>
                  <td className="py-2 px-3">
                    <button className="text-blue-500 hover:underline text-sm">
                      View
                    </button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">Jane Smith</td>
                  <td className="py-2 px-3 text-yellow-500 font-medium">
                    Pending
                  </td>
                  <td className="py-2 px-3">11:30 AM</td>
                  <td className="py-2 px-3">2025-03-01</td>
                  <td className="py-2 px-3">
                    <button className="text-blue-500 hover:underline text-sm">
                      View
                    </button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">Alice Brown</td>
                  <td className="py-2 px-3 text-red-500 font-medium">
                    Canceled
                  </td>
                  <td className="py-2 px-3">02:00 PM</td>
                  <td className="py-2 px-3">2025-03-01</td>
                  <td className="py-2 px-3">
                    <button className="text-blue-500 hover:underline text-sm">
                      View
                    </button>
                  </td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;
