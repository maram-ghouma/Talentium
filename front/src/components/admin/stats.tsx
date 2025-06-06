import { Users, Star, TrendingUp, DollarSign, Award, UserCheck } from 'lucide-react';
import { AdminStats } from '../../types';
interface StatsProps {
    isDarkMode: boolean;
    Adminstats: AdminStats;
  }
const Stats: React.FC<StatsProps>  = ({ isDarkMode, Adminstats }) => {
    return (
    <div className="admin-container">
    <h1 className="admin-title">Dashboard Overview</h1>
    <div className="stats-grid grid grid-cols-3 gap-4">
      <div className="stat-card">
        <div className="stat-icon">
          <Users size={32} />
        </div>
        <div className="stat-content">
          <h3>Total Users</h3>
          <p className="stat-number">{Adminstats?.totalUsers}</p>
          <span className="stat-change positive">+12% this month</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <UserCheck size={32} />
        </div>
        <div className="stat-content">
          <h3>Active Freelancers</h3>
          <p className="stat-number">{Adminstats?.selectedFreelancers}</p>
          <span className="stat-change positive">+8% this month</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <TrendingUp size={32} />
        </div>
        <div className="stat-content">
          <h3>Completed Projects</h3>
          <p className="stat-number">{Adminstats?.completedMissions}</p>
          <span className="stat-change positive">+15% this month</span>
        </div>
      </div>

      
    </div>
    </div>
    )}
    export default Stats;