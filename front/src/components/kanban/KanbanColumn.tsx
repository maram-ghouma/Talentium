import React, { useState, useEffect} from 'react';
import { useDrop } from 'react-dnd';
import  TaskCard  from './TaskCard';
import { Plus } from 'lucide-react';
import './KanbanBoard.css';


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
  onAddTask?: (title: string, description: string) => void;
  onDeleteTask: (taskId: string) => void;
  onRightClick?: (event: React.MouseEvent, taskId: string) => void; 
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, showAddTask = false, onMoveTask, onAddTask, onDeleteTask }) => {
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    taskId: string | null;
  }>({ visible: false, x: 0, y: 0, taskId: null });

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu({ ...contextMenu, visible: false, taskId: null });
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [contextMenu]);

  const handleRightClick = (event: React.MouseEvent, taskId: string) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      taskId,
    });
  };
  const handleDelete = async () => {
    if (contextMenu.taskId && onDeleteTask) {
      await onDeleteTask(contextMenu.taskId);
      setContextMenu({ visible: false, x: 0, y: 0, taskId: null });
    }
  };


  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: { id: string }) => {
      onMoveTask(item.id, column.id as 'not-started' | 'in-progress' | 'completed');
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const [isAdding, setIsAdding] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleAddTask = () => {
    setIsAdding(true);
  };

  return drop(
  <div className={`kanban-column ${isOver ? 'column-drop-target' : ''}`}>
    <div className="column-header">
      <h2 className="column-title">{column.title}</h2>
      <span className="column-count">{column.tasks.length}</span>
    </div>

    <div className="tasks-container">
      {column.tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDeleteTask={onDeleteTask} onRightClick={(e) => handleRightClick(e, task.id)} />
      ))}


      {showAddTask && (
  <div className="add-task-section">
    {isAdding ? (
      <div className="add-task-inputs">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && title.trim()) {
              onAddTask?.(title.trim(), description.trim());
              setTitle('');
              setDescription('');
              setIsAdding(false);
            }
          }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && title.trim()) {
              onAddTask?.(title.trim(), description.trim());
              setTitle('');
              setDescription('');
              setIsAdding(false);
            }
          }}
        />
      </div>
    ) : (
      <button className="add-task-btn" onClick={handleAddTask} aria-label="Add new task">
        <Plus size={16} />
        <span>Add Task</span>
      </button>
    )}
  </div>
)}

    </div>
    {contextMenu.visible && (
  <div
    className="context-menu"
    style={{
      position: 'fixed',
      top: contextMenu.y,
      left: contextMenu.x,
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      padding: '8px 12px',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      zIndex: 1000,
      cursor: 'pointer'
    }}
    onClick={handleDelete}
  >
    Delete Task
  </div>
)}

  </div>
);

};

export default KanbanColumn;