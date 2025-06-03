// src/services/chat.service.ts
import axios from 'axios';
import socketService from './socket.service';
import { Observable } from 'rxjs';

export interface Message {
  id: number;
  contactId: number;
  text: string;
  sent: boolean;
  date: Date;
  isRead: boolean;
}

export interface Contact {
  id: number;
  //name: string;
  //avatar: string;
  unreadCount: number;
  lastMessage?: {
    text: string;
    date: Date;
  };
  isActive: boolean;
}

export interface ConversationMessage {
  id: number;
  conversation: { id: number };
  content: string;
  timestamp: string;
  senderId: number;
  isRead: boolean;
}

export interface Conversation {
  id: number;
  messages: ConversationMessage[];
  isActive: boolean;
  participants: number[];
}

export interface GetConversationsResponse {
  userId: number;
  conversations: Conversation[];
}

class ChatService {
  private apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/chat';
  private contacts: Contact[] = [];
  private messagesMap = new Map<number, Message[]>();
  private currentContact: Contact | null = null;
  private currentMessages: Message[] = [];
  private currentUserId: number | null = null;

  async initialize(): Promise<void> {
    try {
      const { data } = await axios.get<GetConversationsResponse>(`${this.apiUrl}/conversations`);
      this.currentUserId = data.userId;

      const newMap = new Map<number, Message[]>();

      this.contacts = data.conversations.map((convo) => {
        const messages: Message[] = convo.messages
          .map((msg) => ({
            id: msg.id,
            contactId: convo.id,
            text: msg.content,
            sent: msg.senderId === this.currentUserId,
            date: new Date(msg.timestamp),
            isRead: msg.isRead,
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        newMap.set(convo.id, messages);
        

        return {
          id: convo.id,
          /*name: convo.participants[0] === this.currentUserId ? convo.participants[1].name : convo.participants[0].name, // will improve the logic later
          avatar: encodeURIComponent(
            convo.participants[0] === this.currentUserId
              ? convo.participants[1].avatar
              : convo.participants[0].avatar  // will improve the logic later
          ),*/
          unreadCount: messages.filter((msg) => !msg.isRead && !msg.sent).length,
          lastMessage: messages.length
            ? {
                text: messages[messages.length - 1].text,
                date: messages[messages.length - 1].date,
              }
            : {
                text: 'no messages yet',
                date: new Date(),
              },
          isActive: convo.isActive,
        };
      });

      this.messagesMap = newMap;

      socketService.listen<ConversationMessage>('newMessage').subscribe((message) => {
        this.handleIncomingMessage(message);
      });
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  }

  getContacts(): Contact[] {
    return this.contacts;
  }

  getCurrentContact(): Contact | null {
    return this.currentContact;
  }

  getCurrentMessages(): Message[] {
    return this.currentMessages;
  }

  selectContact(contactId: number): void {
    const contact = this.contacts.find((c) => c.id === contactId);
    if (!contact) return;

    socketService.emit('joinRoom', contactId);
    socketService.emit('markAsRead', { conversationId: contactId });

    const updatedMessages = (this.messagesMap.get(contactId) || []).map((msg) => ({
      ...msg,
      isRead: !msg.sent ? true : msg.isRead,
    }));

    this.currentContact = contact;
    this.currentMessages = [];

    // Simulate loading delay (1s) to match Angular
    setTimeout(() => {
      this.currentMessages = updatedMessages;
      this.contacts = this.contacts.map((c) =>
        c.id === contactId ? { ...c, unreadCount: 0 } : c
      );
      this.messagesMap.set(contactId, updatedMessages);
    }, 1000);
  }

  sendMessage(contactId: number, text: string): void {
    const messages = this.messagesMap.get(contactId) || [];
    const newMessage: Message = {
      id: messages.length + 1, // Match Angular's ID generation
      contactId,
      text,
      sent: true,
      date: new Date(),
      isRead: false,
    };

    socketService.emit('sendMessage', {
      conversationId: contactId,
      content: text,
    });

    const updatedMessages = [...messages, newMessage].sort((a, b) => a.date.getTime() - b.date.getTime());
    this.messagesMap.set(contactId, updatedMessages);

    if (this.currentContact?.id === contactId) {
      this.currentMessages = updatedMessages;
    }

    this.contacts = this.contacts.map((c) =>
      c.id === contactId
        ? { ...c, lastMessage: { text, date: newMessage.date } }
        : c
    );
  }

  private handleIncomingMessage(message: ConversationMessage): void {
    const prevMsgs = this.messagesMap.get(message.conversation.id) || [];
    const newMsg: Message = {
      id: message.id,
      contactId: message.conversation.id,
      text: message.content,
      sent: this.currentUserId === message.senderId,
      date: new Date(message.timestamp),
      isRead: false,
    };

    // Check for duplicates using id
    if (!prevMsgs.some((m) => m.id === newMsg.id)) {
      const updatedMessages = [...prevMsgs, newMsg].sort((a, b) => a.date.getTime() - b.date.getTime());
      this.messagesMap.set(newMsg.contactId, updatedMessages);

      // Update unread count
      this.contacts = this.contacts.map((c) =>
        c.id === newMsg.contactId && !newMsg.isRead && !newMsg.sent
          ? { ...c, unreadCount: c.unreadCount + 1 }
          : c
      );

      if (this.currentContact?.id === newMsg.contactId) {
        this.currentMessages = updatedMessages;
      }

      // Update lastMessage
      this.contacts = this.contacts.map((c) =>
        c.id === newMsg.contactId
          ? { ...c, lastMessage: { text: newMsg.text, date: newMsg.date } }
          : c
      );
    }
  }

  searchMessages(contactId: number, query: string): Message[] {
    if (!query.trim()) {
      return this.messagesMap.get(contactId) || [];
    }

    const messages = this.messagesMap.get(contactId) || [];
    return messages.filter((message) =>
      message.text.toLowerCase().includes(query.toLowerCase())
    );
  }

  searchContacts(query: string): Contact[] {
    if (!query.trim()) {
      return this.contacts;
    }

    return this.contacts.filter((contact) =>
      contact.id.toString().includes(query)
      //contact.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  async refreshContacts(): Promise<void> {
    try {
      const { data } = await axios.get<GetConversationsResponse>(`${this.apiUrl}/conversations`);
      if (!data) {
        throw new Error('Failed to fetch conversations: response is undefined');
      }

      this.currentUserId = data.userId;
      const newMap = new Map<number, Message[]>();

      this.contacts = data.conversations.map((convo) => {
        const messages: Message[] = convo.messages
          .map((msg) => ({
            id: msg.id,
            contactId: convo.id,
            text: msg.content,
            sent: this.currentUserId === msg.senderId,
            date: new Date(msg.timestamp),
            isRead: msg.isRead,
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        newMap.set(convo.id, messages);

        return {
          id: convo.id,
          /*name: convo.participants[0] === this.currentUserId ? convo.participants[1].name : convo.participants[0].name, // will improve the logic later
          avatar: encodeURIComponent(
            convo.participants[0] === this.currentUserId ? convo.participants[1].avatar : convo.participants[0].avatar  // will improve the logic later 
          ),*/
          unreadCount: messages.filter((msg) => !msg.isRead && !msg.sent).length,
          isActive: convo.isActive,
          lastMessage: messages.length
            ? {
                text: messages[messages.length - 1].text,
                date: messages[messages.length - 1].date,
              }
            : undefined,
        };
      });

      this.messagesMap = newMap;

      // Update current messages if a contact is selected
      if (this.currentContact) {
        this.currentMessages = this.messagesMap.get(this.currentContact.id) || [];
      }
    } catch (error) {
      console.error('Error refreshing contacts:', error);
    }
  }
}

const chatService = new ChatService();
export default chatService;