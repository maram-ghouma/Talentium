// src/services/Chat/chat.service.ts
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

  private contactsEmitter = new EventEmitter();
  private currentContactEmitter = new EventEmitter();
  private currentMessagesEmitter = new EventEmitter();

  private currentContact: Contact | null = null;
  private currentMessages: ChatMessage[] = [];

  private currentUserId: number | null = null;

  constructor(private socketService: SocketService) {
    this.loadContacts(); // Load initial contacts on service instantiation
    this.listenForIncomingMessages();
    this.listenForIncomingFiles();
    // this.listenForMessageReadUpdates(); // Keep this commented unless you specifically implement read receipts on sender's side
  }

  // Helper to emit contact updates for the sidebar
  private emitContactsUpdate() {
    this.contactsEmitter.emit('update', [...this.contacts]);
  }

  async loadContacts() {
    try {
      const response = await api.get<{ userId: number; conversations: any[] }>(`${this.apiUrl}/conversations`);
      this.currentUserId = response.data.userId;
      console.log('[ChatService][LOAD] Raw API response:', JSON.stringify(response.data, null, 2));

      const contacts = (response.data.conversations || []).map((convo) => {
        const messages = (convo.messages || []).map((msg: any) => ({
          id: msg?.id || 0,
          contactId: convo?.id || 0,
          text: msg?.content || '',
          sent: this.currentUserId === (msg?.sender?.id ?? 0), // Ensure msg.sender.id is used
          date: new Date(msg?.timestamp || Date.now()),
          isRead: msg?.isRead ?? false,
          file: msg?.file ? {
            fileName: msg.file.fileName,
            originalName: msg.file.originalName,
            path: msg.file.path,
          } : undefined,
        })).sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort ascending for chat display order

        this.messagesMap.set(convo?.id || 0, messages);

        // Calculate unreadCount for the contact: only incoming messages that are not read
        const unreadCount = messages.filter(msg => !msg.isRead && !msg.sent).length;
        const otherUser = (convo.participants || []).find(p => p?.id !== this.currentUserId) || {};

        return {
          id: convo?.id || 0,
          name: otherUser?.name || 'Unknown',
          avatar: otherUser?.imageUrl || '',
          unreadCount, // This is the count for the badge!
          isActive: convo?.isActive ?? true,
          lastMessage: (convo.messages || []).length
            ? {
              text: convo.messages[convo.messages.length - 1]?.content || 'No content', // Get last message
              date: new Date(convo.messages[convo.messages.length - 1]?.timestamp || Date.now()),
            }
            : {
              text: 'no messages yet',
              date: new Date(),
            },
        };
      });

      console.log('[ChatService][LOAD] Mapped contacts:', contacts);
      this.contacts = contacts;
      this.emitContactsUpdate(); // Initial emit after loading contacts
    } catch (err: AxiosError | any) {
      console.error('[ChatService][LOAD] Error loading contacts:', {
        message: err.message,
        status: (err.response as any)?.status,
        data: (err.response as any)?.data,
        headers: (err.config as any)?.headers,
        token: localStorage.getItem('authToken')?.slice(0, 20) + '...',
      });
      this.contacts = [];
      this.emitContactsUpdate(); // Emit empty array on error
    }
  }

  getContacts() {
    return this.contacts;
  }

  onContactsUpdate(callback: (contacts: Contact[]) => void) {
    this.contactsEmitter.on('update', callback);
    // Return a function to unsubscribe for better cleanup
    return () => this.contactsEmitter.off('update', callback);
  }

  onCurrentContactUpdate(callback: (contact: Contact | null) => void) {
    this.currentContactEmitter.on('update', callback);
    return () => this.currentContactEmitter.off('update', callback);
  }

  onCurrentMessagesUpdate(callback: (messages: ChatMessage[]) => void) {
    this.currentMessagesEmitter.on('update', callback);
    return () => this.currentMessagesEmitter.off('update', callback);
  }

  setCurrentContact(contactId: number) {
    const contact = this.contacts.find(c => c.id === contactId);

    if (contact) {
      this.socketService.emit('joinRoom', contactId);
      this.socketService.emit('markAsRead', { conversationId: contactId }); // Mark as read on backend

      // Mark messages in the current conversation as read in local state
      const messages = (this.messagesMap.get(contactId) || []).map(msg => ({
        ...msg,
        isRead: msg.sent ? msg.isRead : true, // Mark only *incoming* messages as read
      }));
      this.messagesMap.set(contactId, messages);

      // Reset unread count for this contact to 0, if it had any unread messages
      if (contact.unreadCount > 0) {
        contact.unreadCount = 0;
        this.emitContactsUpdate(); // Crucial: Emit to update sidebar badge for this contact becoming 0
      }

      this.currentContact = contact;
      this.currentContactEmitter.emit('update', contact);

      // Emit current messages update
      this.currentMessages = messages;
      this.currentMessagesEmitter.emit('update', [...messages]);
    }
  }

  sendMessage(contactId: number, message: string) {
    const contact = this.contacts.find(c => c.id === contactId);
    if (!contact) return;

    // Emit the message to the backend via WebSocket
    this.socketService.emit('sendMessage', {
      conversationId: contactId,
      senderId: this.currentUserId, // Ensure senderId is passed
      content: message,
    });

    const messages = this.messagesMap.get(contactId) || [];
    const newMessage: ChatMessage = {
      id: messages.length + 1, // Temporary client-side ID, server will assign real ID
      contactId,
      text: message,
      sent: true,
      date: new Date(),
      isRead: true, // Messages sent by the current user are considered read by them
    };
    messages.push(newMessage);
    this.messagesMap.set(contactId, messages);

    // Update current messages if this is the active chat
    if (this.currentContact?.id === contactId) {
      this.currentMessagesEmitter.emit('update', [...messages]);
    }

    // Update last message for the contact and emit for sidebar
    contact.lastMessage = {
      text: message,
      date: newMessage.date,
    };
    this.emitContactsUpdate(); // Emit contacts update for last message change
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
        text: `File: ${response.data.originalName}`,
        sent: true,
        date: new Date(),
        isRead: true, // Sent files are read by the sender
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
        text: newMessage.text,
        date: newMessage.date,
      };
      this.emitContactsUpdate(); // Emit contacts update for last message change

      // Emit via socket for real-time update to other users in the conversation
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
      throw err;
    }
  }

  listenForIncomingMessages() {
    this.socketService.listen<any>('newMessage').subscribe(async (message) => {
      console.log('[ChatService] Received newMessage from socket:', message);

      const conversationId = message.conversation.id;
      const currentMessages = this.messagesMap.get(conversationId) || [];

      // Determine if the message was sent by the current user (echoed back)
      const isSender = this.currentUserId === message.sender.id;

      // Check for duplicates (important if server echoes messages)
      const exists = currentMessages.some(msg =>
        msg.id === message.id || // Prefer server-assigned ID for uniqueness
        (msg.text === message.content && msg.sent === isSender && Math.abs(new Date(msg.date).getTime() - new Date(message.timestamp).getTime()) < 1000)
      );

      if (exists && isSender) {
          console.log('[ChatService] Ignoring echoed message (already processed locally):', message.content);
          return;
      }
      if (exists && !isSender) {
        // This might happen if `getConversations` already pulled this message
        // or a race condition. Avoid duplicate adds.
        console.log('[ChatService] Ignoring duplicate incoming message from other user:', message.content);
        return;
      }


      const newMessage: ChatMessage = {
        id: message.id, // Use the server-provided ID
        contactId: conversationId,
        text: message.content,
        sent: isSender,
        date: new Date(message.timestamp),
        isRead: this.currentContact?.id === conversationId, // Marked as read if user is in that active chat
      };

      currentMessages.push(newMessage);
      currentMessages.sort((a, b) => a.date.getTime() - b.date.getTime());
      this.messagesMap.set(conversationId, currentMessages);

      const contact = this.contacts.find(c => c.id === conversationId);
      if (contact) {
        // Update last message
        contact.lastMessage = {
          text: message.content,
          date: new Date(message.timestamp),
        };

        // Crucial: Update unread count for the badge
        if (!isSender && this.currentContact?.id !== conversationId) {
          // If it's an incoming message and the user is NOT in this chat
          contact.unreadCount = (contact.unreadCount || 0) + 1;
          console.log(`[ChatService] Incoming unread message for contact ${contact.name}, unreadCount: ${contact.unreadCount}`);
        } else if (!isSender && this.currentContact?.id === conversationId) {
          // If it's an incoming message and the user IS in this chat, mark it as read immediately
          this.socketService.emit('markAsRead', { conversationId: conversationId });
          // unreadCount should already be 0 if it's the current contact, but setting it to 0 defensively
          contact.unreadCount = 0;
        }
        this.emitContactsUpdate(); // Crucial: Emit to update the sidebar badge!
      } else {
        // If the contact doesn't exist locally, it's a new conversation
        // or the contact list is outdated. Refresh contacts to include it.
        console.warn(`[ChatService] Received message for unknown conversation ID ${conversationId}. Refreshing contacts.`);
        await this.refreshContacts();
      }

      // Update current messages if the user is in this active chat
      if (this.currentContact?.id === conversationId) {
        this.currentMessagesEmitter.emit('update', [...currentMessages]);
      }
    });
  }

  listenForIncomingFiles() {
    this.socketService.listen<any>('fileUploaded').subscribe(async (data) => {
      console.log('[ChatService] Received fileUploaded from socket:', data);

      const conversationId = data.conversationId;
      const currentMessages = this.messagesMap.get(conversationId) || [];

      const isSender = this.currentUserId === data.senderId;

      const exists = currentMessages.some(msg =>
          msg.file?.fileName === data.file.fileName &&
          msg.sent === isSender &&
          Math.abs(new Date(msg.date).getTime() - new Date().getTime()) < 1000 // Basic time check for duplicates
      );
      if (exists && isSender) {
          console.log('[ChatService] Ignoring echoed file (already processed locally):', data.file.originalName);
          return;
      }
      if (exists && !isSender) {
        console.log('[ChatService] Ignoring duplicate incoming file from other user:', data.file.originalName);
        return;
      }


      const newMessage: ChatMessage = {
        id: Date.now(), // Server should ideally provide an ID here for files too
        contactId: conversationId,
        text: `File: ${data.file.originalName}`,
        sent: isSender,
        date: new Date(),
        isRead: this.currentContact?.id === conversationId, // Read if active chat
        file: {
          fileName: data.file.fileName,
          originalName: data.file.originalName,
          path: data.file.path,
        },
      };

      currentMessages.push(newMessage);
      currentMessages.sort((a, b) => a.date.getTime() - b.date.getTime());
      this.messagesMap.set(conversationId, currentMessages);

      const contact = this.contacts.find(c => c.id === conversationId);
      if (contact) {
        contact.lastMessage = {
          text: newMessage.text,
          date: newMessage.date,
        };

        if (!isSender && this.currentContact?.id !== conversationId) {
          contact.unreadCount = (contact.unreadCount || 0) + 1;
          console.log(`[ChatService] Incoming unread file for contact ${contact.name}, unreadCount: ${contact.unreadCount}`);
        } else if (!isSender && this.currentContact?.id === conversationId) {
            this.socketService.emit('markAsRead', { conversationId: conversationId });
            contact.unreadCount = 0; // Defensive: ensure unread count is zero if it's the current chat
        }
        this.emitContactsUpdate(); // Crucial: Emit contacts update for sidebar badge!
      } else {
        console.warn(`[ChatService] Received file for unknown conversation ID ${conversationId}. Refreshing contacts.`);
        await this.refreshContacts();
      }

      if (this.currentContact?.id === conversationId) {
        this.currentMessagesEmitter.emit('update', [...currentMessages]);
      }
    });
  }

  // The `refreshContacts` method is good for re-syncing, and it correctly emits contacts update.
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
        })).sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort ascending for chat display

        this.messagesMap.set(convo.id, messages);

        const otherUser = convo.participants.find(p => p.id !== currentUserId);

        return {
          id: convo.id,
          name: otherUser?.name || 'Unknown',
          avatar: otherUser?.imageUrl || '',
          isActive: convo.isActive,
          // Recalculate unread count based on fetched messages
          unreadCount: messages.filter((msg: any) => !msg.isRead && !(currentUserId === msg.sender.id)).length,
          lastMessage: messages.length
            ? {
              text: messages[messages.length - 1].content, // Get the actual last message
              date: messages[messages.length - 1].date,
            }
            : undefined,
        };
      });

      this.contacts = contacts;
      this.emitContactsUpdate(); // Emit update after refreshing all contacts
    } catch (err) {
      console.error('Error refreshing contacts:', err);
      this.contacts = [];
      this.emitContactsUpdate();
    }
  }

  // **Ensuring searchContacts is present**
  searchContacts(query: string): Contact[] {
    return query.trim()
      ? this.contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
      : this.contacts;
  }
}