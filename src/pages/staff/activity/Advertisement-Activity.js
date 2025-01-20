import React, { useState, useEffect } from "react";
import AdminNavBar from "../../../components/AdminNavbar"

const AdvertisementActivitySearch = () => {
  const [keyword, setKeyword] = useState("");
  const [activityLogs, setActivityLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  // Fetch activity logs from the API
  const fetchActivityLogs = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/activity-log");
      const data = await response.json();
      setActivityLogs(data);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  // Filter activity logs based on the search keyword and userType
  const filterLogs = () => {
    const lowercasedKeyword = keyword.toLowerCase();
    const filtered = activityLogs.filter(log =>
      log.userType.toLowerCase() === "staff" &&
      (log.message.toLowerCase().includes(lowercasedKeyword) ||
       log.userType.toLowerCase().includes(lowercasedKeyword))
    );
    setFilteredLogs(filtered);
  };

  // Fetch and filter logs when component mounts or keyword changes
  useEffect(() => {
    fetchActivityLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [keyword, activityLogs]);

  return (
    <>
    <AdminNavBar/>
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Activity Search</h2>
        <input
          type="text"
          placeholder="Search activities..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          />
      </div>

      <div className="bg-gray-200 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
        {filteredLogs.length > 0 ? (
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                    ID
                  </th>
                  {/* <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                    User Type
                    </th> */}
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                    User ID
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                    Message
                  </th>
                  <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-600 font-medium">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      {log.id}
                    </td>
                    {/* <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      {log.userType}
                      </td> */}
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      {log.userId}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      {log.message}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
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
        </>
  );
};

export default AdvertisementActivitySearch;
