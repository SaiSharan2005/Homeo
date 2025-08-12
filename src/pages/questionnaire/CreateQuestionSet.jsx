// src/pages/CreateQuestionSet.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiService from '../../utils/api';

export default function CreateQuestionSet() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [loading, setLoading] = useState(false);

  const questionSet = {
    name,
    description,
    questions,
  };

  const handleQuestionChange = (idx, value) => {
    const newQuestions = [...questions];
    newQuestions[idx] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions(qs => [...qs, '']);
  };

  const handleRemoveQuestion = idx => {
    setQuestions(qs => qs.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.post('/question-sets', questionSet);
      toast.success('Question set created successfully!');
      navigate('/questionnaire');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create question set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
        Create Question Set
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Set Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            placeholder="Enter set name"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
            placeholder="Optional description"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">Questions</label>
          {questions.map((q, idx) => (
            <div key={idx} className="flex items-center mb-3">
              <textarea
                value={q}
                onChange={e => handleQuestionChange(idx, e.target.value)}
                required
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
                placeholder={`Question ${idx + 1}`}
              />
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="ml-2 px-3 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddQuestion}
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none transition transform hover:scale-105"
          >
            + Add Question
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition transform hover:scale-105"
        >
          Create Set
        </button>
      </form>
    </div>
  );
}
