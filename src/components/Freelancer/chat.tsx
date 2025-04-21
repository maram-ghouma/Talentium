import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, Image, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import { Message, ChatConversation } from '../../types';
import '../../Styles/Freelancer/chat.css';
import { chatConversations, messages } from '../../Data/mockData';
import { MainLayout } from '../layout/MainLayout';

const Chat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<Message[]>(messages);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentUserId = "user-1"; // This should come from auth context in a real app

  const selectedConversation = chatConversations.find(
    conv => conv.id === selectedConversationId
  );

  // Filter conversations based on search query
  const filteredConversations = chatConversations.filter(conv => 
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format timestamp to readable time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date for message dividers
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
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
        year: 'numeric'
      });
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    currentMessages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() && selectedConversationId) {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUserId,
        receiverId: selectedConversation?.participantId || '',
        content: inputValue,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      setCurrentMessages([...currentMessages, newMessage]);
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  // Simulate typing indicator
  useEffect(() => {
    if (selectedConversationId && currentMessages.length > 0) {
      const lastMessage = currentMessages[currentMessages.length - 1];
      if (lastMessage.senderId !== currentUserId) {
        setIsTyping(true);
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentMessages, currentUserId, selectedConversationId]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    // Mark messages as read when conversation is selected
    setCurrentMessages(msgs => 
      msgs.map(msg => 
        msg.senderId !== currentUserId && !msg.read 
          ? {...msg, read: true} 
          : msg
      )
    );
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype="freelancer"
      profileName="Freelancer"
      profileRole=""
    >
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
                  src={conversation.participantAvatar} 
                  alt={conversation.participantName} 
                  className="conversation-avatar" 
                />
                
                <div className="conversation-info">
                  <div className="conversation-header">
                    <span className="conversation-name">{conversation.participantName}</span>
                    <span className="conversation-time">
                      {formatMessageTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  
                  <div className="conversation-preview">
                    {conversation.lastMessage.content}
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
                src={selectedConversation.participantAvatar} 
                alt={selectedConversation.participantName} 
                className="chat-header-avatar" 
              />
              
              <div className="chat-header-info">
                <div className="chat-header-name">{selectedConversation.participantName}</div>
                <div className="chat-header-status online">Online</div>
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
                      {formatMessageDate(dateMessages[0].timestamp)}
                    </span>
                  </div>
                  
                  {dateMessages.map(message => (
                    <div 
                      key={message.id}
                      className={`message ${message.senderId === currentUserId ? 'outgoing' : 'incoming'}`}
                    >
                      <div className="message-content">
                        {message.content}
                      </div>
                      <div className="message-time">
                        {formatMessageTime(message.timestamp)}
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
    </MainLayout>
  );
};

export default Chat;