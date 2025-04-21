import React, { useState } from 'react';
import { DollarSign, Calendar, Users, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import Mission from '../../components/Freelancer/mission';
import StatusBadge from '../../components/Freelancer/statusBadge';
import { Mission as MissionType, MissionStatus } from '../../types';
import '../../Styles/Freelancer/home.css';

interface FreelancerHomePageProps {
  freelancerName: string;
  stats: {
    totalEarnings: number;
    completedMissions: number;
    activeClients: number;
    not_assignedMissions: number;
  };
  missions: MissionType[];
}
/* case 'completed':
        
      case 'in_progress':
        
      case 'not_assigned':*/
const FreelancerHomePage: React.FC<FreelancerHomePageProps> = ({
  freelancerName,
  stats,
  missions,
}) => {
  const [activeFilter, setActiveFilter] = useState<MissionStatus | 'All'>('All');

  const statusCounts = {
    'in_progress': missions.filter(m => m.status === 'in_progress').length,
    'completed': missions.filter(m => m.status === 'completed').length,
    'not_assigned': missions.filter(m => m.status === 'not_assigned').length,
  };

  const filteredMissions = activeFilter === 'All' 
    ? missions 
    : missions.filter(mission => mission.status === activeFilter);

  const handleViewMission = (id: string) => {
    console.log(`View mission: ${id}`);
  };

  const handleEditMission = (id: string) => {
    console.log(`Edit mission: ${id}`);
  };

  const handleDeleteMission = (id: string) => {
    console.log(`Delete mission: ${id}`);
  };

  return (
    <div className="freelancer-homepage">
      <div className="stats-container">
        <div className="row">
          <div className="col-md-3 col-sm-6 mb-4">
            <div className="stat-card animate-fade-in">
              <div className="stat-card-icon">
                <DollarSign size={24} />
              </div>
              <div className="stat-card-value">${stats.totalEarnings.toLocaleString()}</div>
              <p className="stat-card-label">Total Earnings</p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="stat-card animate-fade-in">
              <div className="stat-card-icon">
                <Calendar size={24} />
              </div>
              <div className="stat-card-value">{stats.completedMissions}</div>
              <p className="stat-card-label">completed Missions</p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="stat-card animate-fade-in">
              <div className="stat-card-icon">
                <Users size={24} />
              </div>
              <div className="stat-card-value">{stats.activeClients}</div>
              <p className="stat-card-label">Active Clients</p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-4">
            <div className="stat-card animate-fade-in">
              <div className="stat-card-icon">
                <Clock size={24} />
              </div>
              <div className="stat-card-value">{stats.not_assignedMissions}</div>
              <p className="stat-card-label">not_assigned Missions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="recent-missions">
        <div className="dashboard-section-header">
          <h2 className="section-title">Current Missions</h2>
          <a href="#" className="view-all-link">
            View all <ChevronRight size={16} />
          </a>
        </div>

        <div className="missions-filters">
          <button 
            className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
            onClick={() => setActiveFilter('All')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setActiveFilter('in_progress')}
          >
            
            <StatusBadge status="in_progress" count={statusCounts['in_progress']} />
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'not_assigned' ? 'active' : ''}`}
            onClick={() => setActiveFilter('not_assigned')}
          >
            <StatusBadge status="not_assigned" count={statusCounts['not_assigned']} />
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            <StatusBadge status="completed" count={statusCounts['completed']} />
          </button>
        </div>

        <div className="row">
          {filteredMissions.length > 0 ? (
            filteredMissions.map(mission => (
              <div className="col-lg-6 mb-4" key={mission.id}>
                <Mission
                  mission={mission}
                  onView={handleViewMission}
                  onEdit={handleEditMission}
                  onDelete={handleDeleteMission}
                />
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="empty-missions">
                <div className="empty-missions-icon">📋</div>
                <h4 className="empty-missions-text">No {activeFilter !== 'All' ? activeFilter.toLowerCase() : ''} missions found</h4>
                <a href="#" className="btn btn-primary">
                  Find new missions <ArrowRight size={16} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="income-chart">
        <div className="dashboard-section-header">
          <h2 className="section-title">Earnings Overview</h2>
          <div>
            <select className="form-select">
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>This year</option>
            </select>
          </div>
        </div>
        <div className="chart-placeholder">
          {/* Chart would be implemented here with appropriate library */}
          <div style={{ 
            height: '250px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--slate)'
          }}>
            Chart visualization would appear here
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerHomePage;