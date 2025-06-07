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
export const getDisputeStats = async () => {
  const response = await api.get('/dispute/stats');
  return response.data;
};

export const getOpenDisputesWithProfiles = async () => {
  const response = await api.get('/dispute/opened-disputes');
  return response.data;
};

export const deleteUserAndProfiles = async (userId: number,disputeId: number) => {
  const response = await api.patch(`/auth/suspend`, { userId, disputeId });
  return response.data;
};
 
export const updateDisputeResolution = async (disputeId, resolution) => {
  const response = await api.patch(`/dispute/dispute-resolve`, { resolution, disputeId });
  return response.data;
};
export const getResolvedDisputesWithProfiles = async () => {
  const response = await api.get('/dispute/resolved-disputes');
  return response.data;
};