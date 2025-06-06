import { Star, Eye, Link } from 'lucide-react';
import { useState } from 'react';
import { User } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: string;
  user: User;
  phoneNumber: string;
  country: string;
  industry: string;
  linkedIn: string;

}
  interface ClientTableProps {
    clients: Client[];
  }

  const ClientTable: React.FC<ClientTableProps> = ({ clients }) => {
      const navigate = useNavigate();
    const handleViewProfile = (userId: string) => {
      navigate(`/client/profile/${userId}`);
    };
  return (
    <div className="admin-container">
      <h1 className="admin-title">Clients Management</h1>
      <div className="overflow-x-auto">
        <table className="freelancer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Industry</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.user.username}</td>            
                <td>{client.user.email}</td>            
                <td>{client.phoneNumber}</td>
                <td>{client.industry}</td>
                <td>{client.country}</td>
                <td>
                  <button
                          className="view-profile-btn"
                          onClick={() => handleViewProfile(client.user.id)}>
                          <Eye size={16} />
                          View Profile
                        </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;