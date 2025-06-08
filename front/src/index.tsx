// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import { createRoot } from 'react-dom/client'; // This is redundant with ReactDOM.createRoot
import App from './App';
// import ClientsList from './Pages/Admin/ClientsList'; // Not directly needed here, but fine if left
// import AdminDashboard from './Pages/Admin/AdminDashboard'; // Not directly needed here
// import FreelancersList from './Pages/Admin/FreelancersList'; // Not directly needed here

import './index.css';

import { ApolloProvider } from '@apollo/client';
import client from './apollo/client';

// --- Import your services ---
import { SocketService } from './services/Chat/socket.service';
import { ChatService } from './services/Chat/chat.service';
import { NotificationService } from './services/Notification/notification.service';

// --- 1. Create singleton instances of your services ---
// These instances will be created once when your application loads.
const socketService = new SocketService();
const chatService = new ChatService(socketService);

// Get the auth token. This might be empty initially, but NotificationService should handle it.
// It's crucial for the NotificationService to connect to its socket.
const authToken = localStorage.getItem('authToken');
const notificationService = new NotificationService(authToken || ''); // Pass the token or an empty string


// --- 2. Create React Contexts for your services ---
// These allow any child component to easily access the single service instances.
export const ChatServiceContext = React.createContext<ChatService>(chatService);
export const NotificationServiceContext = React.createContext<NotificationService>(notificationService);


// Optional: Add a listener to disconnect sockets when the tab/window is closed
window.addEventListener('beforeunload', () => {
    console.log('Disconnecting sockets before unload...');
    socketService.disconnect();
    notificationService.disconnect();
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* --- 3. Provide the service instances via Contexts --- */}
      <ApolloProvider client={client}> {/* Keep your ApolloProvider */}
        <ChatServiceContext.Provider value={chatService}>
          <NotificationServiceContext.Provider value={notificationService}>
            <App />
          </NotificationServiceContext.Provider>
        </ChatServiceContext.Provider>
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);