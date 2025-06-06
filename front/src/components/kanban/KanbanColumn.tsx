import React from 'react';
import { useDrop } from 'react-dnd';
import  TaskCard  from './TaskCard';
import { Plus } from 'lucide-react';


interface Task {
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

interface KanbanColumnProps {
  column: Column;
  showAddTask?: boolean;
  onMoveTask: (taskId: string, targetStatus: 'not-started' | 'in-progress' | 'completed') => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, showAddTask = false, onMoveTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => {
      onMoveTask(item.id, column.id as 'not-started' | 'in-progress' | 'completed');
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const handleAddTask = () => {
    console.log('Add task clicked in column:', column.id);
  };

  return drop(
  <div className={`kanban-column ${isOver ? 'column-drop-target' : ''}`}>
    <div className="column-header">
      <h2 className="column-title">{column.title}</h2>
      <span className="column-count">{column.tasks.length}</span>
    </div>

    <div className="tasks-container">
      {column.tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      {showAddTask && (
        <button
          className="add-task-btn"
          onClick={handleAddTask}
          aria-label="Add new task"
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      )}
    </div>
  </div>
);

};

export default KanbanColumn;