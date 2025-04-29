import React, { useState } from 'react';
import { Search, Send, Paperclip, ChevronLeft, Phone, Video, MessageSquare } from 'lucide-react';
import { conversations, chatMessages } from '../../Data/mockData';
import '../../Styles/Freelancer/chat.css';

const Chat: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  
  const conversation = conversations.find(c => c.id === selectedConversation);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'user-1',
      senderName: 'Alex Morgan',
      senderAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Filter messages for the selected conversation
  const conversationMessages = selectedConversation 
    ? messages.filter(msg => 
        (msg.senderId === 'user-1' && conversation?.participants.some(p => p.id !== 'user-1')) || 
        conversation?.participants.some(p => p.id === msg.senderId)
      )
    : [];
    
  return (
    <div className="chat-container">
      {/* Conversations List */}
      <div className={`conversation-list ${selectedConversation ? 'hidden md:block' : 'block'}`}>
        <div className="search-container">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className="search-input"
            />
          </div>
        </div>
        
        <div className="conversations-scroll">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              className={`conversation-item ${selectedConversation === conv.id ? 'active' : ''}`}
              onClick={() => setSelectedConversation(conv.id)}
            >
              <div className="avatar">
                <img 
                  src={conv.participants.find(p => p.id !== 'user-1')?.avatar || 'https://via.placeholder.com/40'} 
                  alt={conv.participants.find(p => p.id !== 'user-1')?.name} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <div className="font-medium truncate">
                    {conv.participants.find(p => p.id !== 'user-1')?.name}
                  </div>
                  <div className="text-xs text-slate-500 flex-shrink-0">
                    {conv.lastMessage ? formatDate(conv.lastMessage.timestamp) : ''}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <div className="text-sm truncate text-slate-500">
                    {conv.missionTitle}
                  </div>
                  
                  {conv.unreadCount > 0 && (
                    <div className="ml-auto bg-[#C99E9E] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            <div className="p-3 border-b flex items-center justify-between dark:border-slate-700">
              <div className="flex items-center">
                <button 
                  className="md:hidden mr-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="avatar">
                  <img 
                    src={conversation?.participants.find(p => p.id !== 'user-1')?.avatar || 'https://via.placeholder.com/40'} 
                    alt={conversation?.participants.find(p => p.id !== 'user-1')?.name} 
                  />
                </div>
                
                <div>
                  <div className="font-medium">
                    {conversation?.participants.find(p => p.id !== 'user-1')?.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {conversation?.missionTitle}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Phone size={18} />
                </button>
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                  <Video size={18} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {conversationMessages.map(msg => (
                <div key={msg.id} className={`message-container ${msg.senderId === 'user-1' ? 'sent' : ''}`}>
                  {msg.senderId !== 'user-1' && (
                    <div className="avatar" style={{width: '2rem', height: '2rem', marginTop: '0.25rem'}}>
                      <img 
                        src={msg.senderAvatar || 'https://via.placeholder.com/32'} 
                        alt={msg.senderName} 
                      />
                    </div>
                  )}
                  
                  <div className={`message-bubble ${msg.senderId === 'user-1' ? 'sent' : 'received'}`}>
                    <div>{msg.content}</div>
                    <div className={`text-xs mt-1 ${msg.senderId === 'user-1' ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="message-input-container">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <button type="button" className="p-2 rounded-full hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-700">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="message-input"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  className={`send-button ${newMessage.trim() ? 'active' : 'inactive'}`}
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full flex-col p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 dark:bg-slate-800">
              <MessageSquare size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              Select a conversation from the list to view messages or start a new conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;