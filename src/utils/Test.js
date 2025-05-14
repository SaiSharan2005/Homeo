// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// export default function QuestionnairePage() {
//   // const { id: questionSetId } = useParams();
//   const  questionSetId  = 1;
//   const navigate = useNavigate();

//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchQuestions() {
//       try {
//         const res = await fetch(
//           `${process.env.REACT_APP_BACKEND_URL}/question-sets/${questionSetId}`,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Authorization': `Bearer ${localStorage.getItem('Token')}`,
//             },
//           }
//         );
//         if (!res.ok) throw new Error('Failed to load questions');
//         const data = await res.json();
//         setQuestions(data.questions);
//         // initialize answers state
//         const initAnswers = {};
//         data.questions.forEach(q => {
//           initAnswers[q.id] = '';
//         });
//         setAnswers(initAnswers);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchQuestions();
//   }, [questionSetId]);

//   const handleChange = (questionId, value) => {
//     setAnswers(prev => ({
//       ...prev,
//       [questionId]: value,
//     }));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const payload = {
//       username: localStorage.getItem('Username'),
//       answers: Object.entries(answers).map(([questionId, response]) => ({
//         questionId: Number(questionId),
//         response,
//       })),
//     };

//     try {
//       const res = await fetch(
//         `${process.env.REACT_APP_BACKEND_URL}/question-sets/${questionSetId}/submit`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${localStorage.getItem('Token')}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );
//       if (!res.ok) throw new Error('Submission failed');
//       navigate('/thank-you');
//     } catch (err) {
//       console.error(err);
//       alert('There was a problem submitting your answers.');
//     }
//   };

//   if (loading) {
//     return <div className="p-6 text-center">Loading questions…</div>;
//   }

//   return (
//     <div className="min-h-[400px] flex flex-col justify-center p-6 bg-white rounded-2xl max-w-3xl mx-auto">
//       <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
//         Questionnaire
//       </h2>
//       <form className="space-y-6" onSubmit={handleSubmit}>
//         {questions.map(q => (
//           <div key={q.id} className="flex flex-col">
//             <label htmlFor={`q-${q.id}`} className="mb-2 text-sm font-medium text-gray-700">
//               {q.text}
//             </label>
//             <textarea
//               id={`q-${q.id}`}
//               value={answers[q.id]}
//               onChange={e => handleChange(q.id, e.target.value)}
//               required
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200"
//               placeholder="Your answer..."
//             />
//           </div>
//         ))}

//         <button
//           type="submit"
//           className="w-full py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition transform hover:scale-105"
//         >
//           Submit Answers
//         </button>
//       </form>
//     </div>
//   );
// }

