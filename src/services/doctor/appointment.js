import { deleteData, getData, postData } from '../api';

// Existing functions...
export const fetchDoctorTiming = async () => {
  return await getData('/doctor-timings/doctor/in-use');
};

export const fetchInventoryItems = async (data) => {
  return await getData('/inventory-items',data);
};
export const deleteInventoryItem = async (data) => {
  return await deleteData(`/inventory-items/${data}`);
};
