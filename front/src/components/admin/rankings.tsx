import { Users, Star, DollarSign, Award, UserCheck } from 'lucide-react';
import { ClientProfileType, FreelancerProfileType } from '../../types';

interface RankingsProps {
  isDarkMode: boolean;
  rankedFreelancers: {
    username: string;
    averageRating: number;
    hourlyRate: number;
  }[];
  rankedClients: {
    username: string;
    averageRating: number;
    industry: string;
  }[];
}

const Rankings: React.FC<RankingsProps> = ({
  isDarkMode,
  rankedFreelancers = [],
  rankedClients = [],
}) => {
  return (
    <div className="rankings-container">
      <div className="ranking-section">
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          <Star className="section-icon" size={24} />
          Top Rated Freelancers
        </h2>
        {rankedFreelancers.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className="ranking-cards">
            {rankedFreelancers.map((freelancer, index) => (
              <div key={index} className="ranking-card">
                <div className="ranking-header">
                  <span className="ranking-number">#{index + 1}</span>
                  <span className="rating">
                    <Star size={16} className="star-icon" />
                    {Math.floor(freelancer?.averageRating ?? 0)}
                  </span>
                </div>
                <h3>{freelancer.username}</h3>
                <p className="completed-jobs">
                  Hourly Rate: {freelancer.hourlyRate} $
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="ranking-section">
        <h2 className="section-title" style={{ marginBottom: '2rem' }}>
          <Award className="section-icon" size={24} />
          Top Rated Clients
        </h2>
        {rankedClients.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className="ranking-cards">
            {rankedClients.map((client, index) => (
              <div key={index} className="ranking-card">
                <div className="ranking-header">
                  <span className="ranking-number">#{index + 1}</span>
                  <span className="rating">
                    <Star size={10} className="star-icon" />
                    {Math.floor(client?.averageRating ?? 0)}
                  </span>
                </div>
                <h3>{client.username}</h3>
                <p className="projects-posted">Industry: {client.industry}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rankings;
