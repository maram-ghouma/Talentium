import api from "./axiosConfig";

export const getClientProfile = async () => {
  const response = await api.get('/client-profiles/me');
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/auth/getUser');
  return response.data;
};

export const updateClientProfile = async (formData) => {
  try {
    const response = await api.put('/client-profiles/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};