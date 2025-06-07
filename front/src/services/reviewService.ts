import axios from 'axios';
import { MissionLight } from '../types';
import api from './axiosConfig';


export interface ReviewedUser {
  id: number;
  name: string;
  image: string;
}



export interface reviewData {
  reviewedUserId: number;
  missionId: number;
  reviewerId: number;
    stars: number;
    comment: string;

}
export interface reviewMission{
    id: number;
    title: string;
    description: string;
    price: number;
    client: ReviewedUser;
    selectedFreelancer: ReviewedUser;
}

export interface GetReviewFormDataResponse {
  reviewFormData: reviewData;
}

export async function createReview(reviewData: reviewData): Promise<reviewData> {
  console.log("Submitting review with data:", reviewData);
  try {
    const response = await api.post("/review", reviewData);
    return response.data;
    
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
  
}
export async function getReviewMissionById(id: number): Promise<reviewMission> {
  try {
    const response = await api.get(`/review/mission/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching mission by ID:", error);
    throw error;
  }
}
export enum BadgeType {
  BEGINNER = 'BEGINNER',
  ADVANCED = 'ADVANCED',
  CERTIFIED = 'CERTIFIED',
}
export interface Badge {
  id: number;
  type: BadgeType;
  description: string;
}

export async function getBadgesByUserId(userId: number): Promise<Badge[]> {
  try {
    const response = await api.get(`/user/badges/${userId}`);
    console.log("Fetched badgesssssssssssssssssssssssssss:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching badges by user ID:", error);
    throw error;
  }
}
/*

export const getReviewFormData = async (
  missionId: number,
  reviewedUserId: number
) => {
  const { data } = await client.query<{ reviewFormData: GetReviewFormDataResponse }>({
    query: GET_REVIEW_FORM_DATA,
    variables: { missionId, reviewedUserId },
    fetchPolicy: 'network-only',
  });
  return data.reviewFormData;
};


export const getMyReviews = async (page?: number, limit?: number): Promise<{ data: Review[], totalItems: number, totalPages: number, currentPage: number }> => {
  const { data } = await client.query({
    query: GET_MY_REVIEWS,
    variables: { page, limit },
    fetchPolicy: 'network-only',
  });
  
  const transformedReviews: Review[] = data.getMyReviews.data.map((review: any) => ({
    ...review,
    user: review.reviewedUser, 
  }));

  return {
    data: transformedReviews,
    totalItems: data.getMyReviews.totalItems,
    totalPages: data.getMyReviews.totalPages,
    currentPage: data.getMyReviews.currentPage
  };
};


export const getReceivedReviews = async (userId: number, page?: number, limit?: number): Promise<{ data: Review[], totalItems: number, totalPages: number, currentPage: number }> => {
  const { data } = await client.query({
    query: GET_USER_REVIEWS,
    variables: { userId, page, limit },
    fetchPolicy: 'network-only',
  });
  
  const transformedReviews: Review[] = data.getUserReviews.data.map((review: any) => ({
    ...review,
    user: review.reviewer, 
  }));

  return {
    data: transformedReviews,
    totalItems: data.getUserReviews.totalItems,
    totalPages: data.getUserReviews.totalPages,
    currentPage: data.getUserReviews.currentPage
  };
};





export const getAllReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const getReviewById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    throw error;
  }
};

export const updateReview=async(id: number, reviewData: UpdateReviewPayload) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/${id}`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}


export const deleteReview = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

export const getPaginatedReviews = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${API_URL}/paginate`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching paginated reviews:', error);
    throw error;
  }
};

export const searchReviews = async (searchTerm: string, page: number = 1, limit: number = 6, isMyReviews: boolean = true) => {
  console.log("in the search function front")
  console.log("Search params:", { searchTerm, page, limit, isMyReviews }); // Added logging
  const { data } = await client.query({
    query: SEARCH_REVIEWS,
    variables: {
      searchTerm,
      page,
      limit,
      isMyReviews
    },
  });
  return data.searchMyReviews;
};

export const getReviewsByReviewedUser = async (reviewedUserId: number) => {
  try {
    const response = await axios.get(`${API_URL}/reviewedUser/${reviewedUserId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by reviewed user:', error);
    throw error;
  }
};


export const getReviewsByReviewer = async (reviewerId: number) => {
  try {
    const response = await axios.get(`${API_URL}/reviewer/${reviewerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by reviewer:', error);
    throw error;
  }
};

export const getReviewsByRide = async (rideId: number) => {
  try {
    const response = await axios.get(`${API_URL}/ride/${rideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by ride ID:', error);
    throw error;
  }
};

export const getReviewsByReviewerAndRide = async (reviewerId: number, rideId: number) => {
  try {
    const response = await axios.get(`${API_URL}/reviewer/${reviewerId}/ride/${rideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reviews by reviewer and ride ID:', error);
    throw error;
  }
};*/
