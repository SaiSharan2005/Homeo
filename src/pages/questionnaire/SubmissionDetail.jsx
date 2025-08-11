// src/pages/questionnaire/SubmissionDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchSubmissionById } from '../../services/other/questionnaireApi';

export default function SubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await fetchSubmissionById(id);
        setSubmission(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load submission');
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (!submission) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        &larr; Back to Submissions
      </button>

      <h2 className="text-2xl font-semibold mb-4">
        Answers by {submission.username} on{' '}
        {new Date(submission.submittedAt).toLocaleString()}
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">Question</th>
            <th className="border px-2 py-1">Answer</th>
          </tr>
        </thead>
        <tbody>
          {submission.answers.map((ans, i) => (
            <tr key={`${ans.questionId}-${i}`}>
              {/* use questionText instead of ans.question.text */}
              <td className="border px-2 py-1">{ans.questionText}</td>
              <td className="border px-2 py-1">{ans.response}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
