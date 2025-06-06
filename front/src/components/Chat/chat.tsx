import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, Image, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import '../../Styles/Freelancer/chat.css';
import { ChatService, Contact, ChatMessage } from '../../services/Chat/chat.service'; 
import { SocketService } from '../../services/Chat/socket.service'; 

const Chat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize SocketService and ChatService
  const socketService = useRef(new SocketService()); // Ensure SocketService is configured correctly
  const chatService = useRef(new ChatService(socketService.current));

  // Fetch initial contacts and set up listeners
  useEffect(() => {
    // Subscribe to contacts updates
    chatService.current.onContactsUpdate((updatedContacts: Contact[]) => {
      setContacts(updatedContacts);
    });

    // Subscribe to current messages updates
    chatService.current.onCurrentMessagesUpdate((messages: ChatMessage[]) => {
      setCurrentMessages(messages);
    });

    // Subscribe to current contact updates
    chatService.current.onCurrentContactUpdate((contact: Contact | null) => {
      if (contact) {
        setSelectedConversationId(contact.id);
      } else {
        setSelectedConversationId(null);
      }
    });

    // Initial load of contacts
    chatService.current.getContacts(); // This triggers the initial load and emits updates

    // Cleanup on unmount
    return () => {
      // Note: EventEmitter doesn't have a built-in cleanup, you may need to add removeListener in ChatService
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Simulate typing indicator (adjust based on backend support)
  useEffect(() => {
    if (selectedConversationId && currentMessages.length > 0) {
      const lastMessage = currentMessages[currentMessages.length - 1];
      if (!lastMessage.sent) { // Assuming 'sent' indicates current user's message
        setIsTyping(true);
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentMessages, selectedConversationId]);

  // Find selected conversation from contacts
  const selectedConversation = contacts.find(
    conv => conv.id === selectedConversationId
  );

  // Filter conversations based on search query
  const filteredConversations = searchQuery.trim()
    ? chatService.current.searchContacts(searchQuery)
    : contacts;

  // Format timestamp to readable time
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for message dividers
  const formatMessageDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: ChatMessage[] } = {};

    currentMessages.forEach(message => {
      const date = message.date.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  // Handle selecting a conversation
  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    chatService.current.setCurrentContact(conversationId); // This updates messages and marks as read
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() && selectedConversationId) {
      chatService.current.sendMessage(selectedConversationId, inputValue);
      setInputValue('');
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <div className="chat-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-conversations">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                className={`conversation-item ${conversation.id === selectedConversationId ? 'active' : ''}`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <img
                  src={conversation.avatar || 'default-avatar.png'} // Fallback if avatar is undefined
                  alt={conversation.name}
                  className="conversation-avatar"
                />

                <div className="conversation-info">
                  <div className="conversation-header">
                    <span className="conversation-name">{conversation.name}</span>
                    <span className="conversation-time">
                      {conversation.lastMessage
                        ? formatMessageTime(conversation.lastMessage.date)
                        : ''}
                    </span>
                  </div>

                  <div className="conversation-preview">
                    {conversation.lastMessage?.text || 'No messages yet'}
                  </div>
                </div>

                {conversation.unreadCount > 0 && (
                  <div className="conversation-badge">{conversation.unreadCount}</div>
                )}
              </div>
            ))
          ) : (
            <div className="chat-empty-state">
              <div className="chat-empty-icon">🔍</div>
              <div className="chat-empty-text">No conversations found</div>
              <div className="chat-empty-subtext">Try a different search term</div>
            </div>
          )}
        </div>
      </div>

      <div className="chat-main">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <img
                src={selectedConversation.avatar || 'default-avatar.png'}
                alt={selectedConversation.name}
                className="chat-header-avatar"
              />

              <div className="chat-header-info">
                <div className="chat-header-name">{selectedConversation.name}</div>
                <div className="chat-header-status online">
                  {selectedConversation.isActive ? 'Online' : 'Offline'}
                </div>
              </div>

              <div className="chat-header-actions">
                <button className="chat-header-btn" aria-label="Phone call">
                  <Phone size={16} />
                </button>
                <button className="chat-header-btn" aria-label="Video call">
                  <Video size={16} />
                </button>
                <button className="chat-header-btn" aria-label="More options">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {Object.entries(groupMessagesByDate()).map(([date, dateMessages]) => (
                <React.Fragment key={date}>
                  <div className="message-date-divider">
                    <span className="message-date-label">
                      {formatMessageDate(dateMessages[0].date)}
                    </span>
                  </div>

                  {dateMessages.map(message => (
                    <div
                      key={message.id}
                      className={`message ${message.sent ? 'outgoing' : 'incoming'}`}
                    >
                      <div className="message-content">
                        {message.text}
                      </div>
                      <div className="message-time">
                        {formatMessageTime(message.date)}
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}

              {isTyping && (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                  <span>typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <div className="chat-input-actions">
                  <button className="chat-input-action-btn" aria-label="Attach file">
                    <Paperclip size={20} />
                  </button>
                  <button className="chat-input-action-btn" aria-label="Attach image">
                    <Image size={20} />
                  </button>
                  <button className="chat-input-action-btn" aria-label="Add emoji">
                    <Smile size={20} />
                  </button>
                </div>

                <textarea
                  className="chat-input"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                />

                <button
                  className="chat-send-btn"
                  onClick={handleSendMessage}
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">💬</div>
            <div className="chat-empty-text">Select a conversation to start chatting</div>
            <div className="chat-empty-subtext">Your messages will appear here</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;