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