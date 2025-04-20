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
      clientName: string;
  
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
        
  
    export type User = {
      id: string;
      name: string;
      role: string;
      avatar?: string;
      email: string;
      skills?: string[];
      bio?: string;
      hourlyRate?: number;
      completedMissions?: number;
      rating?: number;
    };
  
    export type ChatMessage = {
      id: string;
      senderId: string;
      senderName: string;
      senderAvatar?: string;
      content: string;
      timestamp: string;
      read: boolean;
    };
  
    export type Conversation = {
      id: string;
      participants: { id: string; name: string; avatar?: string }[];
      missionId?: string;
      missionTitle?: string;
      lastMessage?: ChatMessage;
      unreadCount: number;
    };
  
    export type NotificationType = {
      id: string;
      title: string;
      description: string;
      timestamp: string;
      read: boolean;
      type: 'mission' | 'message' | 'payment' | 'system';
      linkTo?: string;
    };
  
    export type WorkHistoryItem = {
      id: string;
      title: string;
      client: string;
      date: string;
      description: string;
      skills: string[];
      feedback?: string;
      rating?: number;
    };
    export interface Interview {
      id: string;
      candidateName: string;
      topic: string;
      scheduledDateTime: string;
      remindMe: boolean;
    };