import React from 'react';
import { useDrag } from 'react-dnd';

interface Mission {
  id: string;
  title: string;
  description: string;
  client: string;
  startDate: string;
  dueDate: string;
  status: string;
}

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

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return drag(
    <div
      className={`task-card ${isDragging ? 'task-dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      aria-label={`Task: ${task.title}`}
    >
      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
    </div>
  );
};


export default TaskCard;