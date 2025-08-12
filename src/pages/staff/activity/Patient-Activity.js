import React, { useState, useEffect } from "react";
import { getPatientActivity } from "../../../services/activity";

const PatientActivitySearch = () => {
  const [keyword, setKeyword] = useState("");
  const [logsPage, setLogsPage] = useState({ content: [], totalPages: 0 });
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [page, setPage] = useState(0);
  const size = 10; // items per page

  // Reset to first page on new search keyword
  useEffect(() => {
    setPage(0);
  }, [keyword]);

  // Fetch one page of activity logs whenever `page` changes
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getPatientActivity({ page, size });
        setLogsPage({
          content: data.content || [],
          totalPages: data.totalPages || 0,
        });
      } catch (err) {
        console.error("Error fetching activity logs:", err);
        setLogsPage({ content: [], totalPages: 0 });
      }
    };
    fetchLogs();
  }, [page]);

  // Filter current page down to "patient" entries matching keyword
  useEffect(() => {
    const kw = keyword.toLowerCase();
    setFilteredLogs(
      logsPage.content.filter(
        (log) =>
          log.userType.toLowerCase() === "patient" &&
          (log.message.toLowerCase().includes(kw) ||
           log.userId.toString().toLowerCase().includes(kw))
      )
    );
  }, [keyword, logsPage.content]);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-md shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Patient Activity Log
        </h2>

        {/* Search input */}
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Search patient activities by message or ID"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Search patient activities"
          />
        </div>

        {/* Table */}
        {filteredLogs.length > 0 ? (
          <div className="overflow-x-auto mb-4">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 text-gray-600 border-b">
                  {["ID", "User ID", "Message", "Timestamp"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-sm font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
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
          <p className="text-gray-600 text-center">
            No patient activity logs available
          </p>
        )}

        {/* Numbered Pagination Controls */}
        {logsPage.totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: logsPage.totalPages }, (_, i) => (
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
                  Math.min(prev + 1, logsPage.totalPages - 1)
                )
              }
              disabled={page >= logsPage.totalPages - 1}
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

export default PatientActivitySearch;
