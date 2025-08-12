// src/services/questionnaire_api.js

import api from '../api';

// Questionnaire CRUD operations
export const createQuestionnaire = async (questionnaireData) => {
  return api.post('/questionnaires', questionnaireData);
};

export const getAllQuestionnaires = async (page = 0, size = 10) => {
  return api.get(`/questionnaires?page=${page}&size=${size}`);
};

export const getQuestionnaireById = async (id) => {
  return api.get(`/questionnaires/${id}`);
};

export const updateQuestionnaire = async (id, questionnaireData) => {
  return api.put(`/questionnaires/${id}`, questionnaireData);
};

export const deleteQuestionnaire = async (id) => {
  return api.delete(`/questionnaires/${id}`);
};

// Question set operations
export const createQuestionSet = async (questionSetData) => {
  return api.post('/question-sets', questionSetData);
};

export const getAllQuestionSets = async (page = 0, size = 10) => {
  return api.get(`/question-sets?page=${page}&size=${size}`);
};

export const getQuestionSetById = async (id) => {
  return api.get(`/question-sets/${id}`);
};

export const updateQuestionSet = async (id, questionSetData) => {
  return api.put(`/question-sets/${id}`, questionSetData);
};

export const deleteQuestionSet = async (id) => {
  return api.delete(`/question-sets/${id}`);
};

// Question operations
export const createQuestion = async (questionData) => {
  return api.post('/questions', questionData);
};

export const updateQuestion = async (id, questionData) => {
  return api.put(`/questions/${id}`, questionData);
};

export const deleteQuestion = async (id) => {
  return api.delete(`/questions/${id}`);
};

// Patient responses
export const submitQuestionnaireResponse = async (responseData) => {
  return api.post('/questionnaire-responses', responseData);
};

export const getPatientResponses = async (patientId, page = 0, size = 10) => {
  return api.get(`/questionnaire-responses/patient/${patientId}?page=${page}&size=${size}`);
};

export const getQuestionnaireResponses = async (questionnaireId, page = 0, size = 10) => {
  return api.get(`/questionnaire-responses/questionnaire/${questionnaireId}?page=${page}&size=${size}`);
};

// Legacy aliases expected by pages
export const fetchQuestionSets = (page = 0, size = 10) => getAllQuestionSets(page, size);
export const fetchQuestionSetById = (id) => getQuestionSetById(id);
export const submitQuestionnaire = (questionSetId, payload) => api.post(`/questionnaire-responses/submit/${questionSetId}`, payload);
export const fetchSubmissionById = (id) => api.get(`/questionnaire-responses/${id}`);
export const fetchSubmissionsBySet = (setId, page = 0, size = 10) => api.get(`/questionnaire-responses/by-set/${setId}?page=${page}&size=${size}`);
export const fetchSubmissionsByUser = (username, page = 0, size = 10) => api.get(`/questionnaire-responses/user/${username}?page=${page}&size=${size}`);