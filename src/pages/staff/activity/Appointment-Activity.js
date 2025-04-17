import React, { useState, useEffect } from "react";
import AdminNavBar from "../../../components/navbar/AdminNavbar"; // Uncomment if needed

const AppointmentActivitySearch = () => {
  const [keyword, setKeyword] = useState("");
  const [activityLogs, setActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  // Fetch activity logs from the API
  const fetchActivityLogs = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/activity-log`
      );
      const data = await response.json();
      setActivityLogs(data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  // Filter activity logs based on the search keyword and userType
  const filterLogs = () => {
    const lowercasedKeyword = keyword.toLowerCase();
    const filtered = activityLogs.filter(
      (log) =>
        log.userType.toLowerCase() === "appointment" &&
        (log.message.toLowerCase().includes(lowercasedKeyword) ||
          log.userType.toLowerCase().includes(lowercasedKeyword))
    );
    setFilteredLogs(filtered);
  };

  // Fetch logs on component mount
  useEffect(() => {
    fetchActivityLogs();
  }, []);

  // Update filtered logs when keyword or activityLogs change
  useEffect(() => {
    filterLogs();
  }, [keyword, activityLogs]);

  return (
    <div className="container mx-auto p-6">
      {/* Uncomment the AdminNavBar component if needed */}
      {/* <AdminNavBar /> */}
      <div className="bg-white rounded-md shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Appointment Activity Log</h2>
        <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search activities by message or user type"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Search activities"
          />
        </div>
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 text-gray-600 border-b">
                  <th className="px-6 py-3 text-sm font-medium">ID</th>
                  <th className="px-6 py-3 text-sm font-medium">User ID</th>
                  <th className="px-6 py-3 text-sm font-medium">Message</th>
                  <th className="px-6 py-3 text-sm font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition cursor-pointer">
                    <td className="px-6 py-4 border-b">{log.id}</td>
                    <td className="px-6 py-4 border-b">{log.userId}</td>
                    <td className="px-6 py-4 border-b">{log.message}</td>
                    <td className="px-6 py-4 border-b">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No activity logs available</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentActivitySearch;
