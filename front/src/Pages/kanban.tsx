import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { useParams } from 'react-router-dom';
import api from '../services/axiosConfig'; // Your configured axios instance
import { jwtDecode } from 'jwt-decode'; // Named import for jwt-decode

// Define the expected user type values
type UserType = 'admin' | 'client' | 'freelancer';

// Interface for the decoded JWT token
interface DecodedToken {
  userId?: number;
  sub?: number;
  email?: string;
  role?: string;
}

const Kanban: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id: missionId } = useParams<{ id: string }>();

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  // Fetch user type and check access on component mount
  useEffect(() => {
    const checkAccessAndUserType = async () => {
      try {
        console.log('Fetching from:', api.defaults.baseURL);
        const token = localStorage.getItem('authToken');
        console.log('Token in use:', token ? token.slice(0, 20) + '...' : 'No token');

        // Step 1: Decode JWT token to get user type
        if (!token) {
          throw new Error('No authentication token found');
        }
        let decoded: DecodedToken;
        try {
          decoded = jwtDecode(token); // Use named export
          console.log('Decoded token:', decoded);
        } catch (decodeErr) {
          console.error('Token decode error:', decodeErr);
          throw new Error('Invalid token');
        }
        const type = decoded.role;
        if (['admin', 'client', 'freelancer'].includes(type as string)) {
          setUserType(type as UserType);
        } else {
          console.warn('No valid user type in token. Falling back to "client".');
          setUserType('client');
        }

        // Step 2: Check if user can access the mission (client or selected freelancer)
        if (!missionId) {
          throw new Error('Mission ID is missing');
        }
        console.log('Checking access for mission ID:', missionId);
        const response = await api.get(`/mission/kanban/${missionId}`);
        console.log('Mission access response:', response.data);
        // If request succeeds, user is either the client or selected freelancer
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to check access or user type:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        const errorMessage =
          err.response?.status === 404
            ? 'Mission not found or you lack access (must be client or selected freelancer).'
            : err.response?.status === 401
            ? 'Unauthorized: Invalid or missing token.'
            : err.response?.data?.message || err.message || 'Unable to load mission data';
        setError(errorMessage);
        setLoading(false);
      }
    };
    checkAccessAndUserType();
  }, [missionId]);

  // Handle missing missionId
  if (!missionId) {
    return <div>Error: Mission ID is missing</div>;
  }

  // Handle loading state
  if (loading) {
    return <div>Loading mission data...</div>;
  }

  // Handle error state
  if (error || !userType) {
    return <div>{error || 'Error: Invalid user type'}</div>;
  }

  // Common props for MainLayout
  const layoutProps = {
    isDarkMode,
    toggleDarkMode: () => setIsDarkMode(!isDarkMode),
    isSidebarOpen,
    toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
    onSearch: handleSearch,
  };

  // Render based on user type
  return (
    <MainLayout {...layoutProps} usertype={userType}>
      <KanbanBoard missionId={missionId} />
    </MainLayout>
  );
};

export default Kanban;