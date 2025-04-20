export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'not_assigned' | 'in_progress' | 'assigned' | 'completed';
  price: number;
  date: string;
  clientId: string;
  requiredSkills?: string[];
  deadline?: Date | string; 
  budget?: string;
  createdAt?: Date;
}
  export interface Notification {
    id: string;
    message: string;
    read: boolean;
    date: string;
  }
  export interface Interview {
    id: string;
    candidateName: string;
    topic: string;
    scheduledDateTime: string;
    remindMe: boolean;
  }