export type Mission = {
    id: string;
    title: string;
    description: string;
    status: 'not assigned' | 'in progress' | 'completed';
    deadline: string;
    budget: number;
    clientId?: string;
    clientName?: string;
  };
  
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