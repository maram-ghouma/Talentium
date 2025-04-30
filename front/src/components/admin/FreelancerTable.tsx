import { Star, Eye } from 'lucide-react';
import { useState } from 'react';

interface Freelancer {
  id: string;
  name: string;
  rating: number;
  completedJobs: number;
  field: string;
  hourlyRate: number;
  joinedDate: string;
}


  interface FreelancerTableProps {
    freelancers: Freelancer[];
  }
  const FreelancerTable: React.FC<FreelancerTableProps> = ({ freelancers }) => {
  
  return (
    <div className="admin-container">
      <h1 className="admin-title">Freelancers Management</h1>
      <div className="overflow-x-auto">
        <table className="freelancer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Field</th>
              <th>Rating</th>
              <th>Completed Jobs</th>
              <th>Hourly Rate</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {freelancers.map((freelancer) => (
              <tr key={freelancer.id}>
                <td>{freelancer.name}</td>
                <td>{freelancer.field}</td>
                <td>
                  <div className="rating">
                    <Star size={16} className="star-icon" />
                    {freelancer.rating}
                  </div>
                </td>
                <td>{freelancer.completedJobs}</td>
                <td>${freelancer.hourlyRate}/hr</td>
                <td>{new Date(freelancer.joinedDate).toLocaleDateString()}</td>
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