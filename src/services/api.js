const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://api.example.com';

const fetchData = async (endpoint, options = {}) => {
  const token = localStorage.getItem("Token"); // Get fresh token
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Add Authorization if token exists
  };

  const url = `${BASE_URL}${endpoint}`;
  try {

    const response = await fetch(url, {
      headers,
      ...options,
    });

    // if (!response.ok) {
    //   const errorText = await response.text();
    //   throw new Error(`Error ${response.status}: ${errorText}`);
    // }

    // Check if response has content before parsing JSON
    if (response.status === 204) {
      return null; // No Content
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text(); // Handle non-JSON responses
    }
    
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const getData = async (endpoint) => {
  return await fetchData(endpoint, { method: 'GET' });
};

export const postData = async (endpoint, data) => {
  
  return await fetchData(endpoint, { method: 'POST', body: JSON.stringify(data) });
};

export const putData = async (endpoint, data) => {
  return await fetchData(endpoint, { method: 'PUT', body: JSON.stringify(data) });
};

export const deleteData = async (endpoint) => {
  return await fetchData(endpoint, { method: 'DELETE' });
};
