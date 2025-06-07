import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import api from '../../services/axiosConfig'; 

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks for the mission on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await api.get(`missions/kanban/${missionId}`);
        // Map backend data to frontend Task interface
        const mappedTasks: Task[] = response.data.map((task: any) => ({
          id: task.id.toString(), // Convert number to string
          title: task.title,
          description: task.description || '',
          status: task.status.toLowerCase().replace('_', '-') as 'not-started' | 'in-progress' | 'completed', // Map NOT_STARTED -> not-started, etc.
          assignedTo: task.assignedTo || undefined, // Not in backend, optional
          priority: task.priority || undefined, // Not in backend, optional
          dueDate: task.dueDate || undefined, // Not in backend, optional
          createdAt: task.createdAt || new Date().toISOString(), // Fallback if missing
          updatedAt: task.updatedAt || new Date().toISOString(), // Fallback if missing
        }));
        setTasks(mappedTasks);
        console.log('Fetched tasks:', mappedTasks);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        setError(err.response?.data?.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    if (missionId) {
      fetchTasks();
    }
  }, [missionId]);

  // Move task and update backend
  const moveTask = async (taskId: string, targetStatus: 'not-started' | 'in-progress' | 'completed') => {
    try {
      // Map frontend status to backend enum
      const backendStatus = targetStatus.toUpperCase().replace('-', '_') as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
      // Update backend
      await api.patch(`missions/task/${taskId}`, { status: backendStatus });
      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: targetStatus, updatedAt: new Date().toISOString() } : task
        )
      );
    } catch (err: any) {
      console.error('Error updating task status:', err);
      setError(err.response?.data?.message || 'Failed to update task status');
    }
  };
  const addTask = async (title: string, description: string) => {
  try {
    const response = await api.post('missions/task', {
      title,
      description,
      status: 'NOT_STARTED',
      missionId, // if your endpoint needs it
    });

    const newTask: Task = {
      id: response.data.id.toString(),
      title: response.data.title,
      description: response.data.description || '',
      status: 'not-started',
      assignedTo: undefined,
      priority: undefined,
      dueDate: undefined,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
    };

    setTasks(prev => [...prev, newTask]);
  } catch (err: any) {
    console.error('Error adding task:', err);
    setError(err.response?.data?.message || 'Failed to add task');
  }
};

  const deleteTask = async (taskId: string) => {
  try {
    await api.delete(`missions/task/delete/${taskId}`);
    setTasks(prev => prev.filter(task => task.id !== taskId));
  } catch (err: any) {
    console.error('Error deleting task:', err);
    setError(err.response?.data?.message || 'Failed to delete task');
  }
};


  const columns: Column[] = [
    {
      id: 'not-started',
      title: 'Not Started',
      tasks: tasks.filter(task => task.status === 'not-started'),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: tasks.filter(task => task.status === 'in-progress'),
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: tasks.filter(task => task.status === 'completed'),
    },
  ];

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="kanban-board">
      {columns.map(column => (
        <KanbanColumn
          key={column.id}
          column={column}
          showAddTask={column.id === 'not-started'}
          onMoveTask={moveTask}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;