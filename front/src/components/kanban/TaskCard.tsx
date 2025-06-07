import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

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
  onDeleteTask: (taskId: string) => void;
  onRightClick?: (event: React.MouseEvent) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDeleteTask, onRightClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleDelete = () => {
    onDeleteTask(task.id);
  };

  return drag(
    <div
      className={`task-card ${isDragging ? 'task-dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onContextMenu={onRightClick} // Let parent handle context menu
      aria-label={`Task: ${task.title}`}
    >
      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-description">{task.description}</p>}
    </div>
  );
};

export default TaskCard;
