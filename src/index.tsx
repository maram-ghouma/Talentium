import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
import ClientsList from './Pages/Admin/ClientsList'; 

import './index.css';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import FreelancersList from './Pages/Admin/FreelancersList';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> 
      <App />


    </BrowserRouter>
  </React.StrictMode>
);
