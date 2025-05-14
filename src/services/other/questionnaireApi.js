// src/services/questionnaire_api.js

import { getData, postData } from '../api';

/**
 * Pagination params are optional (page defaults to 0, size to 10).
 * Returns the Spring‐Data Page object.
 */
export const fetchQuestionSets = async (page = 0, size = 10) => {
  return await getData(`/question-sets?page=${page}&size=${size}`);
};

/**
 * Create a new Question Set with its questions.
 * payload = { name, description, questions: [{ text }, …] }
 */
export const createQuestionSet = async (payload) => {
  return await postData('/question-sets', payload);
};

/**
 * Fetch a single set (without pagination).
 */
export const fetchQuestionSetById = async (setId) => {
  return await getData(`/question-sets/${setId}`);
};

/**
 * Submit a user’s answers to one set.
 * payload = { answers: [ { questionId, response }, … ] }
 */
export const submitQuestionnaire = async (setId, payload) => {
  return await postData(`/question-sets/${setId}/submit`, payload);
};

/**
 * Fetch paged submissions for a particular Question Set.
 * Returns the Spring‐Data Page object.
 */
export const fetchSubmissionsBySet = async (setId, page = 0, size = 10) => {
  return await getData(`/question-sets/${setId}/submissions?page=${page}&size=${size}`);
};

/**
 * Fetch paged submissions for a particular user.
 */
export const fetchSubmissionsByUser = async (username, page = 0, size = 10) => {
  return await getData(`/submissions/user/${username}?page=${page}&size=${size}`);
};

/**
 * Fetch all submissions globally (paged).
 */
export const fetchAllSubmissions = async (page = 0, size = 10) => {
  return await getData(`/submissions?page=${page}&size=${size}`);
};


export const fetchSubmissionById = async (submissionId) => {
    return await getData(`/submissions/${submissionId}`);
  };