import React, { useState, useEffect } from "react";

const ActivitySearch = () => {
  const [keyword, setKeyword] = useState("");
  const [activityLogs, setActivityLogs] = useState([]);    // current page’s content
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(0);

  // Fetch one page of logs whenever `page` changes
  const fetchActivityLogs = async () => {
    try {
      const resp = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/activity-log?page=${page}&size=${size}`
      );
      if (!resp.ok) throw new Error("Failed to fetch activity logs");
      const data = await resp.json();
      setActivityLogs(data.content || []);
      setTotalPages(data.totalPages ?? 0);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      setActivityLogs([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchActivityLogs();
  }, [page]);

  // Filter current page logs on keyword change
  useEffect(() => {
    if (!keyword) {
      setFilteredLogs(activityLogs);
    } else {
      const kw = keyword.toLowerCase();
      setFilteredLogs(
        activityLogs.filter(
          (log) =>
            log.message.toLowerCase().includes(kw) ||
            log.userType.toLowerCase().includes(kw)
        )
      );
    }
  }, [keyword, activityLogs]);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-md shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity Log</h2>

        {/* Search input */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search activities by message or user type"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setPage(0); // reset to first page on new search
            }}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Search activities"
          />
        </div>

        {/* Table */}
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 text-gray-600 border-b">
                  {["ID", "User Type", "User ID", "Message", "Timestamp"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-sm font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-6 py-4 border-b">{log.id}</td>
                    <td className="px-6 py-4 border-b">{log.userType}</td>
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

        {/* Numbered Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 border rounded ${
                  i === page ? "bg-blue-500 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((prev) =>
                  Math.min(prev + 1, totalPages - 1)
                )
              }
              disabled={page >= totalPages - 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySearch;
