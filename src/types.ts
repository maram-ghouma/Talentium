export interface Mission {
    id: string;
    title: string;
    description: string;
    status: 'not_assigned' | 'in_progress' | 'completed';
    price: number;
    date: string;
    clientId: string;
  }
  
  export interface Notification {
    id: string;
    message: string;
    read: boolean;
    date: string;
  }
 export interface Client {
      id: string;
      name: string;
      rating: number;
      postedmissions: number;
      joinedDate: string;
      interaction: number;
    }
export interface Freelancer {
        id: string;
        name: string;
        rating: number;
        completedJobs: number;
        field: string;
        hourlyRate: number;
        joinedDate: string;
      }
      