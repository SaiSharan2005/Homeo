import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import AdBanner from "../appointments/Adv"; // adjust path if needed
import { fetchQuestionSets } from "../../services/other/questionnaireApi";
import SubmissionList from "./SubmissionList";

const QuestionSetList = ({ defaultFilter = "All" }) => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(defaultFilter);
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSets = async () => {
      setLoading(true);
      try {
        const data = await fetchQuestionSets(page, size);
        setSets(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching question sets:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSets();
  }, [page]);

  // Filter by searchQuery
  const filtered = sets.filter(set =>
    set.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (id) => {
    navigate(`${id}`);
  };

  return (
    <>

    <div className="flex w-full">
      <div className="flex-1 bg-white rounded-md shadow p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Available Question Sets</h2>
            <p className="text-sm text-gray-500">Browse and select a questionnaire to take.</p>
          </div>
          <button
            onClick={() => navigate('create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Add Question Set
          </button>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search by set name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-3 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="py-3 px-4 text-sm font-medium">Name</th>
                <th className="py-3 px-4 text-sm font-medium">Description</th>
                <th className="py-3 px-4 text-sm font-medium"># Questions</th>
                <th className="py-3 px-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {loading ? (
                <tr><td colSpan={4} className="py-4 px-4 text-center">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center">No question sets found.</td>
                </tr>
              ) : (
                filtered.map(set => (
                  <tr
                    key={set.id}
                    className="border-b hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleRowClick(set.id)}
                  >
                    <td className="py-3 px-4 font-medium">{set.name}</td>
                    <td className="py-3 px-4">{set.description}</td>
                    <td className="py-3 px-4">{set.questions?.length || 0}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`update/${set.id}`); }}
                        className="text-blue-500 hover:text-blue-700"
                        title="Edit Set"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); /* add delete logic */ }}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Set"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={() => setPage(p => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 border rounded ${i === page ? 'bg-green-600 text-white' : ''}`}
              >{i + 1}</button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >Next</button>
          </div>
        </div>
      </div>

      {/* <div className="hidden lg:block w-[20%] pl-4">
        <AdBanner targetPage="questionsets-right" />
      </div>

      <div className="w-full mt-6 lg:mt-8">
        <AdBanner targetPage="questionsets-bottom" />
      </div> */}
    </div>
    <div class= "py-5">
    <SubmissionList/>


    </div>
    </>
  );
};

export default QuestionSetList;
