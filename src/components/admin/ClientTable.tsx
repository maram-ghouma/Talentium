import { Star, Eye } from 'lucide-react';
import { useState } from 'react';

interface Client {
  id: string;
  name: string;
  rating: number;
  postedmissions: number;
  joinedDate: string;
  interaction: number;
}


  interface ClientTableProps {
    clients: Client[];
  }
  const FreelancerTable: React.FC<ClientTableProps> = ({ clients }) => {
  
  return (
    <div className="admin-container">
      <h1 className="admin-title">Clients Management</h1>
      <div className="overflow-x-auto">
        <table className="freelancer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rating</th>
              <th>Posted Missions</th>
              <th>Interactions</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>
                  <div className="rating">
                    <Star size={16} className="star-icon" />
                    {client.rating}
                  </div>
                </td>
                <td>{client.postedmissions}</td>
                <td>{client.interaction} Freelancer</td>
                <td>{new Date(client.joinedDate).toLocaleDateString()}</td>
                <td>
                  <button
                    className="view-profile-btn"                  >
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

export default FreelancerTable;