const BASE_URL = process.env.REACT_APP_BACKEND_URL; // Replace with your actual backend URL

const fetchDoctors = async () => {
  try {
    const response = await fetch(`${BASE_URL}/doctor`);
    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }
    return response.json(); // Assuming your API returns JSON data
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return []; // Handle error gracefully in your application
  }
};

const fetchDoctorById = async (doctorId) => {
  try {
    const response = await fetch(`${BASE_URL}/doctor/byId/${doctorId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch doctor with ID ${doctorId}`);
    }
    return response.json(); // Assuming your API returns JSON data
  } catch (error) {
    console.error(`Error fetching doctor with ID ${doctorId}:`, error);
    return null; // Handle error gracefully in your application
  }
};

// Add more functions as needed, such as createDoctor, updateDoctor, deleteDoctor, etc.

export { fetchDoctors, fetchDoctorById };
