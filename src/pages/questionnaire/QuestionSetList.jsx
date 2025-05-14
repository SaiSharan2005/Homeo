// src/pages/questionnaire/QuestionSetList.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestionSets } from '../../services/other/questionnaireApi';

export default function QuestionSetList() {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 0, size: 10 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchQuestionSets(pageInfo.number, pageInfo.size)
      .then(data => {
        setSets(data.content);
        setPageInfo({ number: data.number, totalPages: data.totalPages, size: data.size });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [pageInfo.number, pageInfo.size]);

  const goPage = newPage => {
    if (newPage >= 0 && newPage < pageInfo.totalPages) {
      setPageInfo(p => ({ ...p, number: newPage }));
    }
  };

  if (loading) return <div className="p-6 text-center">Loading…</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Available Questionnaires</h1>
        <button
          onClick={() => navigate('/question-sets/create')}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          + Add Question Set
        </button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sets.map(set => (
          <div key={set.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold">{set.name}</h2>
            <p className="text-gray-600">{set.description}</p>
            <button
              onClick={() => navigate(`/questionnaire/${set.id}`)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              Take Survey
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => goPage(pageInfo.number - 1)}
          disabled={pageInfo.number === 0}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {pageInfo.number + 1} of {pageInfo.totalPages}</span>
        <button
          onClick={() => goPage(pageInfo.number + 1)}
          disabled={pageInfo.number + 1 === pageInfo.totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
