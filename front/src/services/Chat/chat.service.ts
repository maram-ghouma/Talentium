// ChatService.ts

import api from '../axiosConfig';
import { SocketService } from './socket.service';
import { EventEmitter } from 'events';
import { AxiosError } from 'axios';

export interface ChatMessage {
  id: number;
  contactId: number;
  text: string;
  sent: boolean;
  date: Date;
  isRead: boolean;
  file?: {
    fileName: string; // Unique filename stored on the server
    originalName: string; // Original name of the uploaded file
    path: string; // Path to access the file
  };
}

export interface Contact {
  id: number;
  name: string;
  avatar?: string;
  unreadCount: number;
  lastMessage?: {
    text: string;
    date: Date;
  };
  isActive: boolean;
}

export class ChatService {
  private apiUrl = '/chat';

  private contacts: Contact[] = [];
  private messagesMap = new Map<number, ChatMessage[]>();
  private loadedContacts = new Set<number>();

  private contactsEmitter = new EventEmitter();
  private currentContactEmitter = new EventEmitter();
  private currentMessagesEmitter = new EventEmitter();

  private currentContact: Contact | null = null;
  private currentMessages: ChatMessage[] = [];

  private currentUserId: number | null = null; // Replace with actual user ID from auth context

  constructor(private socketService: SocketService) {
    this.loadContacts();
    this.listenForIncomingMessages();
    this.listenForIncomingFiles(); // Add listener for file uploads
  }

  async loadContacts() {
    try {
      const response = await api.get<{ userId: number; conversations: any[] }>(`${this.apiUrl}/conversations`);
      this.currentUserId = response.data.userId;
      console.log('[ChatService][LOAD] Raw API response:', JSON.stringify(response.data, null, 2));

      const contacts = (response.data.conversations || []).map((convo) => {
        console.log('[ChatService][LOAD] Processing convo:', convo?.id || 'undefined');
        const messages = (convo.messages || []).map((msg: any) => ({
          id: msg?.id || 0,
          contactId: convo?.id || 0,
          text: msg?.content || '',
          sent: this.currentUserId === (msg?.senderId ?? 0),
          date: new Date(msg?.timestamp || Date.now()),
          isRead: msg?.isRead ?? false,
          file: msg?.file ? {
            fileName: msg.file.fileName,
            originalName: msg.file.originalName,
            path: msg.file.path,
          } : undefined,
        })).sort((a, b) => a.date.getTime() - b.date.getTime());

        this.messagesMap.set(convo?.id || 0, messages);

        const unreadCount = messages.filter(msg => !msg.isRead && !msg.sent).length;
        const otherUser = (convo.participants || []).find(p => p?.id !== this.currentUserId) || {};

        return {
          id: convo?.id || 0,
          name: otherUser?.name || 'Unknown',
          avatar: otherUser?.imageUrl || '',
          unreadCount,
          isActive: convo?.isActive ?? true,
          lastMessage: (convo.messages || []).length
            ? {
                text: convo.messages[0]?.content || 'No content',
                date: new Date(convo.messages[0]?.timestamp || Date.now()),
              }
            : {
                text: 'no messages yet',
                date: new Date(),
              },
        };
      });

      console.log('[ChatService][LOAD] Mapped contacts:', contacts);
      this.contacts = contacts;
      this.contactsEmitter.emit('update', contacts);
    } catch (err: AxiosError | any) {
      console.error('[ChatService][LOAD] Error loading contacts:', {
        message: err.message,
        status: (err.response as any)?.status,
        data: (err.response as any)?.data,
        headers: (err.config as any)?.headers,
        token: localStorage.getItem('authToken')?.slice(0, 20) + '...',
      });
      this.contacts = [];
      this.contactsEmitter.emit('update', []);
    }
  }

  getContacts() {
    return this.contacts;
  }

  onContactsUpdate(callback: (contacts: Contact[]) => void) {
    this.contactsEmitter.on('update', callback);
  }

  onCurrentContactUpdate(callback: (contact: Contact | null) => void) {
    this.currentContactEmitter.on('update', callback);
  }

  onCurrentMessagesUpdate(callback: (messages: ChatMessage[]) => void) {
    this.currentMessagesEmitter.on('update', callback);
  }

  setCurrentContact(contactId: number) {
    const contact = this.contacts.find(c => c.id === contactId);
    this.socketService.emit('joinRoom', contactId);

    if (contact) {
      this.socketService.emit('markAsRead', { conversationId: contactId });
      contact.unreadCount = 0;
      this.currentContact = contact;
      this.currentContactEmitter.emit('update', contact);

      const messages = (this.messagesMap.get(contactId) || []).map(msg => ({
        ...msg,
        isRead: msg.sent ? msg.isRead : true,
      }));

      this.currentMessages = messages;
      this.currentMessagesEmitter.emit('update', []);

      setTimeout(() => {
        this.currentMessagesEmitter.emit('update', messages);
        this.contactsEmitter.emit('update', [...this.contacts]);
      }, 1000);
    }
  }

  sendMessage(contactId: number, message: string) {
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) return;
    console.log('Sending message:', message, 'to contact ID:', contactId);
    this.socketService.emit('sendMessage', {
      conversationId: contactId,
      senderId: this.currentUserId,
      content: message,
    });
    console.log('Message sent:', message);

    const messages = this.messagesMap.get(contactId) || [];
    const newMessage: ChatMessage = {
      id: messages.length + 1,
      contactId,
      text: message,
      sent: true,
      date: new Date(),
      isRead: false,
    };
    messages.push(newMessage);
    this.messagesMap.set(contactId, messages);

    if (this.currentContact?.id === contactId) {
      this.currentMessagesEmitter.emit('update', [...messages]);
    }

    contact.lastMessage = {
      text: message,
      date: newMessage.date,
    };

    this.contactsEmitter.emit('update', [...this.contacts]);
  }

  async uploadFile(contactId: number, file: File): Promise<void> {
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) {
      console.error('[ChatService][uploadFile] Contact not found for ID:', contactId);
      throw new Error('Contact not found');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', contactId.toString());
      formData.append('senderId', this.currentUserId?.toString() || '');

      const response = await api.post(`${this.apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[ChatService][uploadFile] File uploaded successfully:', response.data);

      const messages = this.messagesMap.get(contactId) || [];
      const newMessage: ChatMessage = {
        id: response.data.id || messages.length + 1, // Use server-provided ID if available
        contactId,
        text: `File: ${file.name}`, // Placeholder text, adjust as needed
        sent: true,
        date: new Date(),
        isRead: false,
        file: {
          fileName: response.data.fileName,
          originalName: response.data.originalName,
          path: response.data.path,
        },
      };

      messages.push(newMessage);
      this.messagesMap.set(contactId, messages);

      if (this.currentContact?.id === contactId) {
        this.currentMessagesEmitter.emit('update', [...messages]);
      }

      contact.lastMessage = {
        text: `File: ${file.name}`,
        date: newMessage.date,
      };

      this.contactsEmitter.emit('update', [...this.contacts]);

      // Emit via socket for real-time update to other users
      this.socketService.emit('fileUploaded', {
        conversationId: contactId,
        senderId: this.currentUserId,
        file: {
          fileName: response.data.fileName,
          originalName: response.data.originalName,
          path: response.data.path,
        },
      });
    } catch (err: AxiosError | any) {
      console.error('[ChatService][uploadFile] Error uploading file:', {
        message: err.message,
        status: (err.response as any)?.status,
        data: (err.response as any)?.data,
      });
      throw err; // Let the component handle the error
    }
  }

  listenForIncomingMessages() {
    this.socketService.listen<any>('newMessage').subscribe((message) => {
      (async () => {
        const currentMessages = [...(this.messagesMap.get(message.conversation.id) || [])];
      
        const exists = currentMessages.some(msg =>
          msg.text === message.content &&
          Math.abs(new Date(msg.date).getTime() - new Date(msg.date).getTime()) < 1000
        );
        if (exists) return;
      
        const response = await api.get<{ userId: number; conversations: any[] }>(`${this.apiUrl}/conversations`);
        const currentUserId = response.data.userId;
      
        const newMessage: ChatMessage = {
          id: message.id,
          contactId: message.conversation.id,
          text: message.content,
          sent: currentUserId === message.sender.id,
          date: new Date(message.timestamp),
          isRead: false,
        };
      
        currentMessages.push(newMessage);
        currentMessages.sort((a, b) => a.date.getTime() - b.date.getTime());
      
        this.messagesMap.set(message.conversation.id, currentMessages);
      
        if (this.currentContact?.id === message.conversation.id) {
          this.currentMessagesEmitter.emit('update', currentMessages);
        }
      })();
    });
  }

  listenForIncomingFiles() {
    this.socketService.listen<any>('fileUploaded').subscribe((data) => {
      (async () => {
        const currentMessages = [...(this.messagesMap.get(data.conversationId) || [])];
      
        const exists = currentMessages.some(msg =>
          msg.file?.fileName === data.file.fileName &&
          Math.abs(new Date(msg.date).getTime() - new Date().getTime()) < 1000
        );
        if (exists) return;
      
        const response = await api.get<{ userId: number; conversations: any[] }>(`${this.apiUrl}/conversations`);
        const currentUserId = response.data.userId;
      
        const newMessage: ChatMessage = {
          id: currentMessages.length + 1, // Ideally, get ID from server via socket data
          contactId: data.conversationId,
          text: `File: ${data.file.originalName}`,
          sent: currentUserId === data.senderId,
          date: new Date(),
          isRead: false,
          file: {
            fileName: data.file.fileName,
            originalName: data.file.originalName,
            path: data.file.path,
          },
        };
      
        currentMessages.push(newMessage);
        currentMessages.sort((a, b) => a.date.getTime() - b.date.getTime());
      
        this.messagesMap.set(data.conversationId, currentMessages);
      
        const contact = this.contacts.find(c => c.id === data.conversationId);
        if (contact) {
          contact.lastMessage = {
            text: `File: ${data.file.originalName}`,
            date: newMessage.date,
          };
          if (!newMessage.sent && this.currentContact?.id !== data.conversationId) {
            contact.unreadCount = (contact.unreadCount || 0) + 1;
          }
          this.contactsEmitter.emit('update', [...this.contacts]);
        }
      
        if (this.currentContact?.id === data.conversationId) {
          this.currentMessagesEmitter.emit('update', currentMessages);
        }
      })();
    });
  }

  searchMessages(contactId: number, query: string): ChatMessage[] {
    const messages = this.messagesMap.get(contactId) || [];
    return query.trim()
      ? messages.filter(m => 
          m.text.toLowerCase().includes(query.toLowerCase()) ||
          m.file?.originalName.toLowerCase().includes(query.toLowerCase())
        )
      : messages;
  }

  searchContacts(query: string): Contact[] {
    return query.trim()
      ? this.contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
      : this.contacts;
  }

  async refreshContacts(): Promise<void> {
    try {
      const response = await api.get<{ userId: number; conversations: any[] }>(`${this.apiUrl}/conversations`);
      const currentUserId = response.data.userId;

      const contacts = response.data.conversations.map((convo) => {
        const messages = convo.messages.map((msg: any) => ({
          id: msg.id,
          contactId: convo.id,
          text: msg.content,
          sent: currentUserId === msg.sender.id,
          date: new Date(msg.timestamp),
          isRead: msg.isRead,
          file: msg.file ? {
            fileName: msg.file.fileName,
            originalName: msg.file.originalName,
            path: msg.file.path,
          } : undefined,
        })).sort((a, b) => b.date.getTime() - a.date.getTime());

        this.messagesMap.set(convo.id, [...messages].reverse());

        const otherUser = convo.participants.find(p => p.id !== currentUserId);

        return {
          id: convo.id,
          name: otherUser?.name || 'Unknown',
          avatar: otherUser?.imageUrl || '',
          isActive: convo.isActive,
          unreadCount: convo.messages.filter((msg: any) => !msg.isRead && !(currentUserId === msg.sender.id)).length,
          lastMessage: convo.messages.length
            ? {
                text: convo.messages[0].content,
                date: convo.messages[0].timestamp,
              }
            : undefined,
        };
      });

      this.contacts = contacts;
      this.contactsEmitter.emit('update', contacts);
    } catch (err) {
      console.error('Error refreshing contacts:', err);
    }
  }
}