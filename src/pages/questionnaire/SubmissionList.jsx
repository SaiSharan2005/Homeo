// src/pages/questionnaire/SubmissionList.jsx

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
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Submissions</h1>

      <select
        className="mb-4 px-3 py-2 border rounded"
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

      {loading ? (
        <div>Loading submissions…</div>
      ) : selectedSet && (
        <>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">User</th>
                <th className="border px-2 py-1">Submitted At</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub, idx) => (
                <tr key={sub.submissionId}>
                  <td className="border px-2 py-1">
                    {idx + 1 + pageInfo.number * pageInfo.size}
                  </td>
                  <td className="border px-2 py-1">{sub.username}</td>
                  <td className="border px-2 py-1">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => navigate(`/submissions/${sub.submissionId}`)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Answers
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mb-6 space-x-4">
            <button
              onClick={() => changePage(-1)}
              disabled={pageInfo.number === 0}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {pageInfo.number + 1} of {pageInfo.totalPages}</span>
            <button
              onClick={() => changePage(1)}
              disabled={pageInfo.number + 1 === pageInfo.totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
