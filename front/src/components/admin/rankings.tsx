import { Users, Star, DollarSign, Award, UserCheck } from 'lucide-react';
interface RankingsProps {
  isDarkMode: boolean;
}
const Rankings: React.FC<RankingsProps>  = () => {
    const topFreelancers = [
        { name: 'Sarah Johnson', rating: 4.9, completedJobs: 156, field: 'Web Development' },
        { name: 'Michael Chen', rating: 4.8, completedJobs: 143, field: 'UI/UX Design' },
        { name: 'Emma Wilson', rating: 4.8, completedJobs: 128, field: 'Content Writing' }
      ];
    
      const topClients = [
        { name: 'Tech Solutions Inc.', projectsPosted: 45, avgRating: 4.9 },
        { name: 'Creative Studios', projectsPosted: 38, avgRating: 4.8 },
        { name: 'Global Innovations', projectsPosted: 32, avgRating: 4.7 }
      ];
    return (
<div className="rankings-container">
<div className="ranking-section">
  <h2 className="section-title">
    <Star className="section-icon" size={24} />
    Top Rated Freelancers
  </h2>
  <div className="ranking-cards">
    {topFreelancers.map((freelancer, index) => (
      <div key={index} className="ranking-card">
        <div className="ranking-header">
          <span className="ranking-number">#{index + 1}</span>
          <span className="rating">
            <Star size={16} className="star-icon" />
            {freelancer.rating}
          </span>
        </div>
        <h3>{freelancer.name}</h3>
        <p className="field">{freelancer.field}</p>
        <p className="completed-jobs">{freelancer.completedJobs} jobs completed</p>
      </div>
    ))}
  </div>
</div>

<div className="ranking-section">
  <h2 className="section-title">
    <Award className="section-icon" size={24} />
    Top Clients
  </h2>
  <div className="ranking-cards">
    {topClients.map((client, index) => (
      <div key={index} className="ranking-card">
        <div className="ranking-header">
          <span className="ranking-number">#{index + 1}</span>
          <span className="rating">
            <Star size={16} className="star-icon" />
            {client.avgRating}
          </span>
        </div>
        <h3>{client.name}</h3>
        <p className="projects-posted">{client.projectsPosted} projects posted</p>
      </div>
    ))}
  </div>
</div>
</div>
    )}
export default Rankings;