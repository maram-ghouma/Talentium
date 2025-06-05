import api from "./axiosConfig";

export const getClientProfile = async () => {
  const response = await api.get('/client-profile/me');
  return response.data;
};

export const getUser = async () => {
  const response = await api.get('/auth/getUser');
  return response.data;
};

export const updateClientProfile = async (formData) => {
  try {
    const response = await api.put('/client-profile/update', formData, {
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


export const getFreelancerProfile = async () => {
  const response = await api.get('/freelancer-profile/me');
  return response.data;
};

export const updateFreelancerProfile = async (formData) => {
  try {
    const response = await api.put('/freelancer-profile/update', formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, 
        'Content-Type': 'multipart/form-data',

      },
    });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const getFreelancerMissions = async () => {
  const response = await api.get('/mission/my-freelancer-missions');
  return response.data;
};

export const getClientMissions = async () => {
  const response = await api.get('/mission/my-client-missions');
  return response.data;
};

export const getClientReviews = async () => {
  const response = await api.get('/review/myReviewsClient');
  return response.data;
};


export const getFreelancerReviews = async () => {
  const response = await api.get('/review/myReviewsFreelancer');
  return response.data;
};
export const signOut = () => {
  localStorage.removeItem('authToken'); 
  window.location.href = '/';
};

export const getFreelancerStats = async () => {
  const response = await api.get('/freelancer-profile/stats');
  return response.data;
};
export const getClientStats = async () => {
  const response = await api.get('/client-profile/stats');
  return response.data;
};