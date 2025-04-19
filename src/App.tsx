import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import FreelancersList from './Pages/Admin/FreelancersList';
import ClientHome from './Pages/Client/ClientHomePage';
import ClientsList from './Pages/Admin/ClientsList';
import ReportsInterface from './Pages/Admin/ReportsInterface';
import ClientHomePage from './Pages/Client/ClientHomePage';

function App() {
 
  return (
    <Routes>
  <Route path="/admin/clients" element={<ClientsList />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/admin/freelancers" element={<FreelancersList />} />
  <Route path="/admin/reports" element={<ReportsInterface />} />
  <Route path="/client" element={< ClientHomePage/>} />



</Routes>
  );
}

export default App;