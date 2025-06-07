import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { useParams } from 'react-router-dom';
import api from '../../services/axiosConfig';

const ClientKanban: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { id: missionId } = useParams<{ id: string }>();

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleSeedNotification = async () => {
    try {
      // Try common token key names
      let token = localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('jwt');
      
      if (!token) {
        console.error('No token found in localStorage. Checked keys: token, authToken, jwt');
        alert('❌ Failed to send notification: No token found. Please log in or check with your team for token storage.');
        return;
      }

      console.log('Found token:', token);
      const response = await api.post(
        '/notifications/seed',
        {
          content: '🔔 Test notification from Kanban page!',
          type: 'test',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Notification seeded:', response.data);
      alert('✅ Notification sent!');
    } catch (error) {
      console.error('Error sending notification:', error);
      // Type guard to safely access error.message
      if (error instanceof Error) {
        alert('❌ Failed to send notification: ' + error.message);
      } else {
        alert('❌ Failed to send notification: Unknown error');
      }
    }
  };

  if (!missionId) {
    return <div>Error: Mission ID is missing</div>;
  }

  return (
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype="client"
      profileName="Client"
      profileRole=""
    >
      <KanbanBoard missionId={missionId} />
      
      {/* Notification Test Button */}
      <div style={{ padding: '1rem' }}>
        <button
          onClick={handleSeedNotification}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '2rem',
          }}
        >
          Send Test Notification
        </button>
      </div>
    </MainLayout>
  );
};

export default ClientKanban;