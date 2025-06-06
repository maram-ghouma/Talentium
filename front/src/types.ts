    export interface Mission {
      id: string;
      title: string;
      description: string;
      status: 'not_assigned' | 'in_progress' | 'assigned' | 'completed';//assigned a eliminer
      /* case 'completed':
        
      case 'in_progress':
        
      case 'not_assigned':*/
      price: number;
      date: string;
      clientId: string;
      client?: string;
      clientLogo?: string;
      requiredSkills?: string[];
      deadline?: Date | string; 
      budget?: string;
      createdAt?: Date;
      clientName: string;
      paymentStatus?: 'Paid' | 'Unpaid' | 'Partial';
      priority?: 'Low' | 'Medium' | 'High';
      progress?: number;
      tasks: {
        total: number;
        completed: number;
      };
  
    }
    export type MissionStatus = 'not_assigned' | 'in_progress' | 'assigned' | 'completed';
    
   
  
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
      username: string;
      role: string;
      imageUrl?: string;
      email: string;
      
      };
    
  
    export interface Message {
      id: string;
      senderId: string;
      receiverId: string;
      content: string;
      timestamp: string;
      read: boolean;
      attachments?: {
        name: string;
        url: string;
        type: string;
      }[];
    }
    

  
    export interface ChatConversation {
      id: string;
      participantId: string;
      participantName: string;
      participantAvatar: string;
      lastMessage: Message;
      unreadCount: number;
    }
  
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
      id: string
  title: string
  client: ClientProfileType
  date: string
  description: string
  deadline?: string
  requiredSkills: string[]
  review?: Review;
}

    export interface Profile {
      id: string;
      name: string;
      title: string;
      avatar: string;
      location: string;
      email: string;
      phone: string;
      bio: string;
      skills: string[];
      hourlyRate: number;
      availability: string;
      joinedDate: string;
      socialLinks: {
        linkedin?: string;
        github?: string;
        portfolio?: string;
        twitter?: string;
      };
    }
export interface ClientProfileType {
  id: number;
  companyName?: string;
  industry?: string;
  linkedIn?: string;
  phoneNumber?: string;
  country?: string;
  bio?: string;
  user: User;
}

export interface FreelancerProfileType {
  id: number;
  skills?: string[];
  hourlyRate?: number;
  phoneNumber?: string;
  country?: string;
  bio?: string;
  github?: string;
  linkedIn?: string;
  user: User;
}
    export interface Interview {
      id: string;
      candidateName: string;
      topic: string;
      scheduledDateTime: string;
      remindMe: boolean;
    };
    
    
 
   
    
   
 export interface FormDataType {
  name: string;
  tagline: string;
  company: string;
  country: string;
  industry: string;
  email: string;
  phone: string;
  linkedin: string;
  avatar: string;
}
export interface Review {
  id: string;
  reviewer: User;
  reviewee: User;
  stars: number;
  comment: string;
  date: string;
  
}

export interface FreelancerStats {
  averageRating: number;
  totalMissions: number;
  missionsInProgress: number;
  completedMissions: number;

}
export interface ClientStats {
  averageRating: number;
  totalMissions: number;
  missionsInProgress: number;
  hiredFreelancers: number;

}
export interface AdminStats {
  totalUsers: number;
  selectedFreelancers: number;
  completedMissions: number;
}