import api from "./axiosConfig";

export const getAdminStats = async () => {
  const response = await api.get('/mission/admin-stats');
  return response.data;
};
export const getTopRatedFreelancers = async () => {
  const response = await api.get('/review/top-rated-freelancers');
  return response.data;
};
export const getTopRatedClients = async () => {
  const response = await api.get('/review/top-rated-clients');
  return response.data;
};

export const getAllClients = async () => {
  const response = await api.get('/client-profile/AllClients');
  return response.data;
};

export const getAllFreelancers = async () => {
  const response = await api.get('/freelancer-profile/AllFreelancers');
  return response.data;
};