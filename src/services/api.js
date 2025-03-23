// src/services/api.js

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://api.example.com';


const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem("Token")}` // Replace `token` with your actual token variable

};

/**
 * A generic function to make API calls.
 * @param {string} endpoint - API endpoint (e.g., '/users')
 * @param {object} options - Fetch options (e.g., method, body, etc.)
 */
const fetchData = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      headers,
      ...options,
    });

    if (!response.ok) {
      // You might want to enhance this by handling different error statuses
      const errorMessage = await response.text();
      throw new Error(`Error ${response.status}: ${errorMessage}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// GET request
export const getData = async (endpoint) => {
  return await fetchData(endpoint, {
    method: 'GET',
  });
};

// POST request
export const postData = async (endpoint, data) => {
  return await fetchData(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// PUT request
export const putData = async (endpoint, data) => {
  return await fetchData(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// DELETE request
export const deleteData = async (endpoint) => {
  return await fetchData(endpoint, {
    method: 'DELETE',
  });
};
