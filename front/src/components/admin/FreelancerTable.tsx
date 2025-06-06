import { Star, Eye } from 'lucide-react';
import { useState } from 'react';
import { User } from '../../types';
import { useNavigate } from 'react-router-dom';

interface Freelancer {
  id: string;
   user: User;
   phoneNumber: string;
   country: string;
   hourlyRate: number;
}


  interface FreelancerTableProps {
    freelancers: Freelancer[];
  }
  const FreelancerTable: React.FC<FreelancerTableProps> = ({ freelancers }) => {
  const navigate = useNavigate();
    const handleViewProfile = (userId: string) => {
      navigate(`/freelancer/profile/${userId}`);
    };
  return (
    <div className="admin-container">
      <h1 className="admin-title">Freelancers Management</h1>
      <div className="overflow-x-auto">
        <table className="freelancer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Hourly Rate</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {freelancers.map((freelancer) => (
              <tr key={freelancer.id}>
                <td>{freelancer.user.username}</td>
                <td>{freelancer.user.email}</td>
                <td>{freelancer.phoneNumber}</td>
                <td>${freelancer.hourlyRate}/hr</td>
                <td>{freelancer.country}</td>
                <td>
                  <button
                    className="view-profile-btn"
                    onClick={() => handleViewProfile(freelancer.user.id)}
                  >
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