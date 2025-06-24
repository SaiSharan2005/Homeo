import { getData, postData, putData, deleteData } from '../api';

// Fetch all categories
export const fetchCategories = async () => {
  return await getData('/categories');
};

// Fetch a single category by ID
export const fetchCategoryById = async (id) => {
  return await getData(`/categories/${id}`);
};

// Create a new category
export const createCategory = async (categoryDto) => {
  return await postData('/categories', categoryDto);
};

// Update an existing category
export const updateCategory = async (id, categoryDto) => {
  return await putData(`/categories/${id}`, categoryDto);
};

// Delete a category
export const deleteCategory = async (id) => {
  return await deleteData(`/categories/${id}`);
};
