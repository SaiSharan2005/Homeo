import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestionSets, fetchSubmissionsBySet } from '../../services/other/questionnaireApi';

export default function SubmissionList() {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [subs, setSubs] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 0, size: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestionSets(0, 100).then(data => setSets(data.content));
  }, []);

  useEffect(() => {
    if (!selectedSet) return;
    setLoading(true);
    fetchSubmissionsBySet(selectedSet, pageInfo.number, pageInfo.size)
      .then(data => {
        setSubs(data.content);
        setPageInfo({ number: data.number, totalPages: data.totalPages, size: data.size });
      })
      .finally(() => setLoading(false));
  }, [selectedSet, pageInfo.number, pageInfo.size]);

  const changePage = delta => {
    const np = pageInfo.number + delta;
    if (np >= 0 && np < pageInfo.totalPages) {
      setPageInfo(p => ({ ...p, number: np }));
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex-1 bg-white rounded-md shadow p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Submissions</h1>
            <p className="text-sm text-gray-500">Select a question set to view user submissions.</p>
          </div>
        </div>

        <div className="mb-4">
          <select
            className="w-full sm:w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedSet}
            onChange={e => {
              setSelectedSet(e.target.value);
              setPageInfo(p => ({ ...p, number: 0 }));
            }}
          >
            <option value="">-- Choose a set --</option>
            {sets.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="py-4 text-center text-gray-600">Loading submissions…</div>
        ) : selectedSet && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-left border-collapse">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="py-3 px-4 text-sm font-medium">#</th>
                    <th className="py-3 px-4 text-sm font-medium">User</th>
                    <th className="py-3 px-4 text-sm font-medium">Submitted At</th>
                    <th className="py-3 px-4 text-sm font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                  {subs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center">No submissions found.</td>
                    </tr>
                  ) : (
                    subs.map((sub, idx) => (
                      <tr key={sub.submissionId} className="border-b hover:bg-gray-50 transition">
                        <td className="py-3 px-4">{idx + 1 + pageInfo.number * pageInfo.size}</td>
                        <td className="py-3 px-4">{sub.username}</td>
                        <td className="py-3 px-4">{new Date(sub.submittedAt).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(`/submissions/${sub.submissionId}`)}
                            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                          >
                            View Answers
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                onClick={() => changePage(-1)}
                disabled={pageInfo.number === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >Prev</button>
              <span className="text-gray-600">Page {pageInfo.number + 1} of {pageInfo.totalPages}</span>
              <button
                onClick={() => changePage(1)}
                disabled={pageInfo.number + 1 === pageInfo.totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >Next</button>
            </div>
          </>
        )}
      </div>

      {/* Optional Ad Banner */}
      {/* <div className="hidden lg:block w-[20%] pl-4">
        <AdBanner targetPage="submissions-right" />
      </div> */}
    </div>
  );
}
