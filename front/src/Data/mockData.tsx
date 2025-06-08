import type { Mission, User, Message, ChatConversation,Interview, NotificationType, WorkHistoryItem,Client,Freelancer, Profile } from "../types"
// Adapting missions from the provided mock data
export const missions: Mission[] = [
  
]

export const notifications: NotificationType[] = [
  {
    id: "notif-1",
    title: "New Mission Proposal",
    description: "You have received a new mission proposal for Logo Design",
    timestamp: "2023-09-16T09:15:00Z",
    read: false,
    type: "mission",
    linkTo: "/mission/proposal-1"
  },
  {
    id: "notif-2",
    title: "New Message",
    description: "Sarah Tech sent you a message about Mobile App Development",
    timestamp: "2023-09-16T14:20:00Z",
    read: false,
    type: "message",
    linkTo: "/chat/conv-2"
  },
  {
    id: "notif-3",
    title: "Payment Received",
    description: "You received a payment of $1,800 for Brand Identity Design",
    timestamp: "2023-09-15T18:30:00Z",
    read: true,
    type: "payment",
    linkTo: "/payments/payment-1"
  }
]

// Creating clients based on the provided data
export const clients: Client[] = [
  {
    id: "client-1",
    name: "John Client",
    rating: 4.7,
    postedmissions: 3,
    joinedDate: "10/01/2023",
    interaction: 15
  },
  {
    id: "client-2",
    name: "Sarah Tech",
    rating: 4.9,
    postedmissions: 5,
    joinedDate: "05/11/2022",
    interaction: 23
  },
  {
    id: "client-3",
    name: "Green Earth Foods",
    rating: 5.0,
    postedmissions: 1,
    joinedDate: "20/12/2023",
    interaction: 7
  }
]

// Creating freelancers based on the user provided
export const freelancers: Freelancer[] = [
  {
    id: "user-1",
    name: "Alex Morgan",
    rating: 4.9,
    completedJobs: 47,
    field: "UI/UX Design",
    hourlyRate: 55,
    joinedDate: "15/05/2019"
  }
]

// Adapting messages
export const messages: Message[] = [
  {
    id: "msg-1",
    senderId: "client-1",
    receiverId: "user-1",
    content: "Hi Alex, how is the website redesign coming along?",
    timestamp: "2023-09-15T10:30:00Z",
    read: true
  },
  {
    id: "msg-2",
    senderId: "user-1",
    receiverId: "client-1",
    content: "Going great! I've completed the wireframes and started on the high-fidelity designs. Would you like to see the progress?",
    timestamp: "2023-09-15T10:35:00Z",
    read: true
  },
  {
    id: "msg-3",
    senderId: "client-1",
    receiverId: "user-1",
    content: "Yes, please share them when you have a moment.",
    timestamp: "2023-09-15T10:40:00Z",
    read: true
  },
  {
    id: "msg-4",
    senderId: "client-2",
    receiverId: "user-1",
    content: "Alex, we need to discuss the app development timeline. Are you available for a call tomorrow?",
    timestamp: "2023-09-16T14:20:00Z",
    read: false
  },
]

// Creating chat conversations
export const chatConversations: ChatConversation[] = [
  {
    id: "conv-1",
    participantId: "client-1",
    participantName: "John Client",
    participantAvatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    lastMessage: {
      id: "msg-3",
      senderId: "client-1",
      receiverId: "user-1",
      content: "Yes, please share them when you have a moment.",
      timestamp: "2023-09-15T10:40:00Z",
      read: true
    },
    unreadCount: 0
  },
  {
    id: "conv-2",
    participantId: "client-2",
    participantName: "Sarah Tech",
    participantAvatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    lastMessage: {
      id: "msg-4",
      senderId: "client-2",
      receiverId: "user-1",
      content: "Alex, we need to discuss the app development timeline. Are you available for a call tomorrow?",
      timestamp: "2023-09-16T14:20:00Z",
      read: false
    },
    unreadCount: 1
  }
]

// Adapting work history
export const workHistory: WorkHistoryItem[] = [
  
]

// Creating user profile
export const profile: Profile = {
  id: "user-1",
  name: "Alex Morgan",
  title: "UI/UX Designer",
  avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  location: "San Francisco, CA",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 123-4567",
  bio: "Passionate UI/UX designer with 5+ years of experience creating intuitive and engaging user experiences for web and mobile applications.",
  skills: ["UI Design", "UX Research", "Wireframing", "Prototyping", "Figma", "Adobe XD"],
  hourlyRate: 55,
  availability: "Available for new projects",
  joinedDate: "15/05/2019",
  socialLinks: {
    linkedin: "https://linkedin.com/in/alexmorgan",
    github: "https://github.com/alexmorgan",
    portfolio: "https://alexmorgan.design",
    twitter: "https://twitter.com/alexmorgan_ux"
  }
}

// Creating interviews
export const interviews: Interview[] = [
  {
    id: "interview-1",
    candidateName: "John Client",
    topic: "Website Redesign Project Discussion",
    scheduledDateTime: "2024-03-25T14:00:00Z",
    remindMe: true
  },
  {
    id: "interview-2",
    candidateName: "Sarah Tech",
    topic: "Mobile App Development Planning",
    scheduledDateTime: "2024-03-26T10:30:00Z",
    remindMe: true
  }
]


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
// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Design Homepage Wireframe',
    description: 'Create wireframes for the homepage layout including header, hero section, features, and footer.',
    status: 'completed',
    assignedTo: 'user-1',
    priority: 'high',
    dueDate: '2025-04-15',
    createdAt: '2025-04-10T10:00:00Z',
    updatedAt: '2025-04-12T15:30:00Z'
  },
  {
    id: 'task-2',
    title: 'Develop Homepage HTML/CSS',
    description: 'Convert approved wireframes into responsive HTML/CSS for the homepage.',
    status: 'in-progress',
    assignedTo: 'user-2',
    priority: 'high',
    dueDate: '2025-04-20',
    createdAt: '2025-04-12T09:00:00Z',
    updatedAt: '2025-04-16T11:45:00Z'
  },
  {
    id: 'task-3',
    title: 'Implement About Us Page',
    description: 'Develop the About Us page based on approved designs including team section and company history.',
    status: 'not-started',
    assignedTo: 'user-2',
    priority: 'medium',
    dueDate: '2025-04-25',
    createdAt: '2025-04-12T14:20:00Z',
    updatedAt: '2025-04-12T14:20:00Z'
  },
  {
    id: 'task-4',
    title: 'Optimize Images',
    description: 'Compress and optimize all website images for improved performance.',
    status: 'not-started',
    assignedTo: 'user-3',
    priority: 'low',
    dueDate: '2025-04-22',
    createdAt: '2025-04-13T08:45:00Z',
    updatedAt: '2025-04-13T08:45:00Z'
  },
  {
    id: 'task-5',
    title: 'Cross-browser Testing',
    description: 'Test website functionality across Chrome, Firefox, Safari, and Edge browsers.',
    status: 'not-started',
    assignedTo: 'user-1',
    priority: 'medium',
    dueDate: '2025-05-01',
    createdAt: '2025-04-14T13:15:00Z',
    updatedAt: '2025-04-14T13:15:00Z'
  },
  {
    id: 'task-6',
    title: 'Create Contact Form',
    description: 'Develop contact form with validation and email functionality.',
    status: 'in-progress',
    assignedTo: 'user-3',
    priority: 'high',
    dueDate: '2025-04-18',
    createdAt: '2025-04-11T16:30:00Z',
    updatedAt: '2025-04-15T10:20:00Z'
  },
  {
    id: 'task-7',
    title: 'SEO Optimization',
    description: 'Implement meta tags, descriptions, and other SEO best practices.',
    status: 'in-progress',
    assignedTo: 'user-4',
    priority: 'medium',
    dueDate: '2025-04-29',
    createdAt: '2025-04-15T09:00:00Z',
    updatedAt: '2025-04-17T14:10:00Z'
  },
  {
    id: 'task-8',
    title: 'Client Review Meeting',
    description: 'Present current progress to client and gather feedback.',
    status: 'completed',
    assignedTo: 'user-1',
    priority: 'high',
    dueDate: '2025-04-16',
    createdAt: '2025-04-10T11:30:00Z',
    updatedAt: '2025-04-16T18:00:00Z'
  }
];