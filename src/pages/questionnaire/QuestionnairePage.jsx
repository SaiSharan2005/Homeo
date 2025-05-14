// src/pages/questionnaire/QuestionnairePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestionSetById, submitQuestionnaire } from '../../services/other/questionnaireApi';

export default function QuestionnairePage() {
  const { id: questionSetId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestionSetById(questionSetId)
      .then(data => {
        setQuestions(data.questions);
        const init = {};
        data.questions.forEach(q => (init[q.id] = ''));
        setAnswers(init);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load questions');
      })
      .finally(() => setLoading(false));
  }, [questionSetId]);

  const handleChange = (qid, val) =>
    setAnswers(prev => ({ ...prev, [qid]: val }));

  const handleSubmit = e => {
    e.preventDefault();
    submitQuestionnaire(questionSetId, {
      answers: Object.entries(answers).map(([qid, resp]) => ({
        questionId: Number(qid),
        response: resp,
      })),
    })
      .then(() => navigate('/login'))
      .catch(err => {
        console.error(err);
        alert('Submission failed');
      });
  };

  if (loading) return <div className="p-6 text-center">Loading…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6 text-center">Questionnaire</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map(q => (
          <div key={q.id}>
            <label className="block mb-2 font-medium">{q.text}</label>
            <textarea
              value={answers[q.id]}
              onChange={e => handleChange(q.id, e.target.value)}
              required
              rows={3}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded-lg"
        >
          Submit Answers
        </button>
      </form>
    </div>
  );
}
