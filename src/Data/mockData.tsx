import { Mission, User, ChatMessage, Conversation, NotificationType, WorkHistoryItem } from '../types';

export const currentUser: User = {
  id: 'user-1',
  name: 'Alex Morgan',
  role: 'UI/UX Designer',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  email: 'alex.morgan@example.com',
  skills: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'Figma', 'Adobe XD'],
  bio: 'Passionate UI/UX designer with 5+ years of experience creating intuitive and engaging user experiences for web and mobile applications.',
  hourlyRate: 55,
  completedMissions: 47,
  rating: 4.9
};

export const missions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Website Redesign',
    description: 'Need a complete redesign of our e-commerce website with modern UI/UX principles.',
    status: 'not_assigned',
    date: '15/03/2024',
    price: 2500,
    clientName: 'EcoShop Inc.',
    clientId: 'client-1',

  },
  {
    id: 'mission-2',
    title: 'Mobile App Development',
    description: 'Looking for a developer to create an iOS/Android app for our service.',
    status: 'in_progress',
    date: '14/03/2024',
    price: 5000,
    clientName: 'TechStart Solutions',
    clientId: 'client-1',

  },
  {
    id: 'mission-3',
    title: 'Brand Identity Design',
    description: 'Create a comprehensive brand identity including logo, color scheme, and typography.',
    status: 'completed',
    date: '10/02/2024',
    price: 1800,
    clientName: 'Green Earth Foods',
    clientId: 'client-1',

  },
  {
    id: 'mission-4',
    title: 'Marketing Campaign Creatives',
    description: 'Design social media creatives for our upcoming summer campaign.',
    status: 'in_progress',
    date: '20/03/2024',
    price: 1200,
    clientName: 'Sunshine Beverages',
    clientId: 'client-1',

  }
];

export const chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'client-1',
    senderName: 'John Client',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: 'Hi Alex, how is the website redesign coming along?',
    timestamp: '2023-09-15T10:30:00Z',
    read: true
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    senderName: 'Alex Morgan',
    senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: 'Going great! I\'ve completed the wireframes and started on the high-fidelity designs. Would you like to see the progress?',
    timestamp: '2023-09-15T10:35:00Z',
    read: true
  },
  {
    id: 'msg-3',
    senderId: 'client-1',
    senderName: 'John Client',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: 'Yes, please share them when you have a moment.',
    timestamp: '2023-09-15T10:40:00Z',
    read: true
  },
  {
    id: 'msg-4',
    senderId: 'client-2',
    senderName: 'Sarah Tech',
    senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: 'Alex, we need to discuss the app development timeline. Are you available for a call tomorrow?',
    timestamp: '2023-09-16T14:20:00Z',
    read: false
  }
];

export const conversations: Conversation[] = [
  {
    id: 'conv-1',
    participants: [
      { id: 'user-1', name: 'Alex Morgan', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
      { id: 'client-1', name: 'John Client', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }
    ],
    missionId: 'mission-1',
    missionTitle: 'Website Redesign',
    lastMessage: {
      id: 'msg-3',
      senderId: 'client-1',
      senderName: 'John Client',
      content: 'Yes, please share them when you have a moment.',
      timestamp: '2023-09-15T10:40:00Z',
      read: true
    },
    unreadCount: 0
  },
  {
    id: 'conv-2',
    participants: [
      { id: 'user-1', name: 'Alex Morgan', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
      { id: 'client-2', name: 'Sarah Tech', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }
    ],
    missionId: 'mission-2',
    missionTitle: 'Mobile App Development',
    lastMessage: {
      id: 'msg-4',
      senderId: 'client-2',
      senderName: 'Sarah Tech',
      content: 'Alex, we need to discuss the app development timeline. Are you available for a call tomorrow?',
      timestamp: '2023-09-16T14:20:00Z',
      read: false
    },
    unreadCount: 1
  }
];

export const notifications: NotificationType[] = [
  {
    id: 'notif-1',
    title: 'New Mission Proposal',
    description: 'You have received a new mission proposal for Logo Design',
    timestamp: '2023-09-16T09:15:00Z',
    read: false,
    type: 'mission',
    linkTo: '/mission/proposal-1'
  },
  {
    id: 'notif-2',
    title: 'New Message',
    description: 'Sarah Tech sent you a message about Mobile App Development',
    timestamp: '2023-09-16T14:20:00Z',
    read: false,
    type: 'message',
    linkTo: '/chat/conv-2'
  },
  {
    id: 'notif-3',
    title: 'Payment Received',
    description: 'You received a payment of $1,800 for Brand Identity Design',
    timestamp: '2023-09-15T18:30:00Z',
    read: true,
    type: 'payment',
    linkTo: '/payments/payment-1'
  }
];

export const workHistory: WorkHistoryItem[] = [
  {
    id: 'work-1',
    title: 'Brand Identity Design',
    client: 'Green Earth Foods',
    date: 'Feb 2024',
    description: 'Created a comprehensive brand identity including logo, color scheme, and typography for an organic food company.',
    skills: ['Branding', 'Logo Design', 'Typography'],
    feedback: 'Alex delivered exceptional work! The brand identity perfectly captures our company values.',
    rating: 5.0
  },
  {
    id: 'work-2',
    title: 'E-commerce Website Redesign',
    client: 'FashionHub',
    date: 'Jan 2024',
    description: 'Complete redesign of e-commerce website with focus on improving user experience and increasing conversion rates.',
    skills: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping'],
    feedback: 'Great work on our website redesign. Sales increased by 25% after implementation.',
    rating: 4.8
  },
  {
    id: 'work-3',
    title: 'Mobile App UI Design',
    client: 'HealthTrack',
    date: 'Dec 2023',
    description: 'Designed the user interface for a health tracking mobile application for iOS and Android platforms.',
    skills: ['Mobile Design', 'UI Design', 'Figma', 'Prototyping'],
    feedback: 'Alex was professional and delivered on time. Good communication throughout the project.',
    rating: 4.7
  }
];