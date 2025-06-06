import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { mockTasks } from '../../Data/mockData';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}


interface KanbanBoardProps {
  missionId: string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ missionId }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const moveTask = (taskId: string, targetStatus: 'not-started' | 'in-progress' | 'completed') => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: targetStatus } : task
      )
    );
  };

  const columns: Column[] = [
    {
      id: 'not-started',
      title: 'Not Started',
      tasks: tasks.filter(task => task.status === 'not-started')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: tasks.filter(task => task.status === 'in-progress')
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: tasks.filter(task => task.status === 'completed')
    }
  ];

  return (
    <div className="kanban-board">
      {columns.map(column => (
        <KanbanColumn 
          key={column.id} 
          column={column} 
          showAddTask={column.id === 'not-started'}
          onMoveTask={moveTask}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;