import { Users, Star, TrendingUp, DollarSign, Award, UserCheck } from 'lucide-react';
interface StatsProps {
    isDarkMode: boolean;
  }
const Stats: React.FC<StatsProps>  = () => {
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
          <p className="stat-number">24,583</p>
          <span className="stat-change positive">+12% this month</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <UserCheck size={32} />
        </div>
        <div className="stat-content">
          <h3>Active Freelancers</h3>
          <p className="stat-number">15,247</p>
          <span className="stat-change positive">+8% this month</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <TrendingUp size={32} />
        </div>
        <div className="stat-content">
          <h3>Completed Projects</h3>
          <p className="stat-number">8,392</p>
          <span className="stat-change positive">+15% this month</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <DollarSign size={32} />
        </div>
        <div className="stat-content">
          <h3>Revenue Generated</h3>
          <p className="stat-number">$1.2M</p>
          <span className="stat-change positive">+18% this month</span>
        </div>
      </div>
    </div>
    </div>
    )}
    export default Stats;