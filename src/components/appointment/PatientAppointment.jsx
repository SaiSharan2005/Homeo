// src/pages/patient/InstructionsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchInstructionsByPatient } from '../../services/other/prescriptionApi';
import { fetchSubmissionsByUser } from '../../services/other/questionnaireApi';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function InstructionsPage({ patientId, patientUsername }) {
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId || !patientUsername) {
      alert('Missing patient information. Please log in.');
      navigate('/login');
      return;
    }

    Promise.all([
      fetchInstructionsByPatient(patientId),
      fetchSubmissionsByUser(patientUsername, 0, 100)
    ])
      .then(([instrData, subPage]) => {
        setInstructions(instrData);
        setSubmissions(subPage.content || []);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load data. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [patientId, patientUsername, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin w-10 h-10 border-4 border-t-transparent border-teal-500 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Combined Instructions & Responses Section */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-600 mb-4 border-b-2 border-teal-100 pb-1">General Instructions</h1>

        {/* Instructions List */}
        <ul className="space-y-4 mb-6">
          {instructions.length === 0 ? (
            <li className="flex items-center text-yellow-800 bg-yellow-100 p-3 rounded-lg">
              <AlertCircle className="mr-2 h-5 w-5" /> <span>No instructions found.</span>
            </li>
          ) : (
            instructions.map((inst) => (
              <li
                key={inst.id || inst.dateIssued}
                className="bg-white p-4 rounded-lg border-l-4 border-teal-500 hover:shadow-lg transition-shadow relative"
              >
                <p className="text-gray-800 leading-relaxed">
                  {inst.generalInstructions}
                </p>
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {format(new Date(inst.dateIssued), 'PPP p')}
                </div>
              </li>
            ))
          )}
        </ul>

        {/* Questionnaire Responses under same section */}
        <div className="mb-4">
          {submissions.length === 0 ? null : (
            submissions.map((sub) => (
              <div
                key={sub.submissionId}
                className="bg-white shadow hover:shadow-lg rounded-lg overflow-hidden border-t-4 border-teal-500 mb-4 transition-shadow"
              >
                <div className="bg-teal-500 text-white px-4 py-2 font-semibold">
                  {format(new Date(sub.submittedAt), 'PPP p')}
                </div>
                <div className="p-4 space-y-4">
                  {sub.answers.map((ans) => (
                    <div key={`${sub.submissionId}-${ans.questionId}`}>
                      <div className="text-gray-700 font-semibold mb-1">
                        {ans.questionText}
                      </div>
                      <div className="bg-gray-50 border border-gray-200 p-3 rounded-md text-gray-800">
                        {ans.response}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}