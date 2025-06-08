import api from "./axiosConfig";

export const getClientProfile = async (id?: number | null) => {
  const endpoint = id ? `/client-profile/me?id=${id}` : '/client-profile/me';
  const response = await api.get(endpoint);
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


export const getFreelancerProfile = async (id?: number | null) => {
  const endpoint = id ? `/freelancer-profile/me?id=${id}` : '/freelancer-profile/me';
  const response = await api.get(endpoint);
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

export const getFreelancerMissions = async (id?: number | null) => {
  const endpoint = id ? `/mission/my-freelancer-missions?id=${id}` : '/mission/my-freelancer-missions';
  const response = await api.get(endpoint);
  return response.data;
};

export const getClientMissions = async (id?: number | null) => {
  const endpoint = id ? `/mission/my-client-missions?id=${id}` : '/mission/my-client-missions';
  const response = await api.get(endpoint);
  return response.data;
};

export const getClientReviews = async (id?: number | null) => {
  const endpoint = id ? `/review/myReviewsClient?id=${id}` : '/review/myReviewsClient';
  const response = await api.get(endpoint);
  return response.data;
};


export const getFreelancerReviews = async (id?: number | null) => {
  const endpoint = id ? `/review/myReviewsFreelancer?id=${id}` : '/review/myReviewsFreelancer';
  const response = await api.get(endpoint);
  return response.data;
};
export const signOut = () => {
  localStorage.removeItem('authToken'); 
  window.location.href = '/';
};

export const getMyStatsFreelancer = async () => {
  const endpoint = `/freelancer-profile/MyStats` ;
  const response = await api.get(endpoint);
  return response.data; 
};
export const getFreelancerStats = async (id ) => {
  const  response = await api.get('/freelancer-profile/stats', { params: { id } });

  return response.data;
};
export const getMyStats = async () => {
  const endpoint = `/client-profile/MyStats` ;
  const response = await api.get(endpoint);
  return response.data; 
};
export const getClientStats = async (id ) => {
  const  response = await api.get('/client-profile/stats', { params: { id } });

  return response.data;
};

export const SwitchProfile = async (newRole) => {
  const response = await api.patch('/auth/switch-role', { newRole });
  if (newRole === 'freelancer') {
    window.location.href = '/Freelancer';
  }
  else if (newRole === 'client') {
    window.location.href = '/Client';
  }
  return response.data;
};

export const getFreelancerMissionsWithReviews = async () => {
  const response = await api.get('mission/my-missions-with-reviews');
  return response.data;
};
export const getClientName = async (): Promise<string | null> => {
    const response = await api.get(`/auth/getClientName`);
    console.log('Client name response:', response.data);
    return response.data || 'error';
  }

  export const CreateReportFreelancer = async (data ) => {
  const  response = await api.post('/dispute/createFreelancer', data);

  return response.data;
};