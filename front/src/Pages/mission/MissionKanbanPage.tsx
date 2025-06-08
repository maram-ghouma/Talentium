import React from 'react';
import KanbanBoard from '../../components/kanban/KanbanBoard';

export interface Mission {
  id: string;
  title: string;
  description: string;
  client: string;
  startDate: string;
  dueDate: string;
  status: string;
}

// Sample mission data (would typically come from an API)
const missionData: Mission = {
  id: 'mission-123',
  title: 'Website Redesign for XYZ Corp',
  description: 'Complete redesign of corporate website including homepage, about us, services, and contact pages.',
  client: 'XYZ Corporation',
  startDate: '2025-04-10',
  dueDate: '2025-05-25',
  status: 'active'
};

const MissionKanbanPage: React.FC = () => {
  return (
    <div className="mission-kanban-page">
      <header className="mission-header">
        <h1 className="mission-title">{missionData.title}</h1>
        <p className="mission-description">{missionData.description}</p>
      </header>
      
      <KanbanBoard missionId={missionData.id} />
    </div>
  );
};

export default MissionKanbanPage;