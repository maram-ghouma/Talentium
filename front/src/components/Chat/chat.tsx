import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, Video, X } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for full-screen image
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize SocketService and ChatService
  const socketService = useRef(new SocketService());
  const chatService = useRef(new ChatService(socketService.current));

  // Fetch initial contacts and set up listeners
  useEffect(() => {
    chatService.current.onContactsUpdate((updatedContacts: Contact[]) => {
      setContacts(updatedContacts);
    });

    chatService.current.onCurrentMessagesUpdate((messages: ChatMessage[]) => {
      setCurrentMessages(messages);
    });

    chatService.current.onCurrentContactUpdate((contact: Contact | null) => {
      if (contact) {
        setSelectedConversationId(contact.id);
      } else {
        setSelectedConversationId(null);
      }
    });

    chatService.current.getContacts();

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    if (selectedConversationId && currentMessages.length > 0) {
      const lastMessage = currentMessages[currentMessages.length - 1];
      if (!lastMessage.sent) {
        setIsTyping(true);
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentMessages, selectedConversationId]);

  const selectedConversation = contacts.find(
    conv => conv.id === selectedConversationId
  );

  const filteredConversations = searchQuery.trim()
    ? chatService.current.searchContacts(searchQuery)
    : contacts;

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    chatService.current.setCurrentContact(conversationId);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && selectedConversationId) {
      chatService.current.sendMessage(selectedConversationId, inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle file selection and upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedConversationId) {
      try {
        await chatService.current.uploadFile(selectedConversationId, file);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('File upload failed:', error);
        alert('Failed to upload file. Please try again.');
      }
    }
  };

  // Trigger file input click
  const handleAttachClick = () => {
    if (selectedConversationId) {
      fileInputRef.current?.click();
    } else {
      alert('Please select a conversation to upload a file.');
    }
  };

  // Handle file download
  const handleFileDownload = (filePath: string, originalName: string) => {
    const downloadUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/${filePath}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check if a file is an image based on extension
  const isImageFile = (fileName: string | undefined): boolean => {
    if (!fileName) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  // Close the image overlay
  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="chat-container">
      {/* Full-screen image overlay */}
      {selectedImage && (
        <div className="image-overlay" onClick={handleCloseImage}>
          <button className="image-overlay-close" aria-label="Close image">
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Full-screen image"
            className="image-overlay-content"
          />
        </div>
      )}

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
                  src={conversation.avatar || 'default-avatar.png'}
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
              </div>
              <div className="chat-header-actions">
                <button className="chat-header-btn" aria-label="Video call">
                  <Video size={16} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {Object.entries(groupMessagesByDate()).map(([date, dateMessages]) => (
                <React.Fragment key={date}>
                  <div className="message-date-divider">
                    <span className="message-date-label">
                      {formatMessageDate(dateMessages[0]?.date || new Date())}
                    </span>
                  </div>
                  {dateMessages.map((message) => {
                    const file = message.file;
                    return (
                      <div
                        key={message.id}
                        className={`message ${message.sent ? 'outgoing' : 'incoming'}`}
                      >
                        <div className="message-content">
                          {file ? (
                            isImageFile(file.originalName) ? (
                              <img
                                src={`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/${file.path}`}
                                alt={file.originalName || 'Image'}
                                className="message-image"
                                style={{ maxWidth: '200px', borderRadius: '8px', cursor: 'pointer' }}
                                onClick={() => setSelectedImage(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/${file.path}`)}
                              />
                            ) : (
                              <a
                                href="#"
                                className="message-file"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleFileDownload(file.path, file.originalName || 'unknown');
                                }}
                              >
                                <strong>{file.originalName || 'unknown'}</strong>
                              </a>
                            )
                          ) : (
                            message.text
                          )}
                        </div>
                        <div className="message-time">
                          {formatMessageTime(message.date)}
                        </div>
                      </div>
                    );
                  })}
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
                  <button
                    className="chat-input-action-btn"
                    aria-label="Attach file"
                    onClick={handleAttachClick}
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
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