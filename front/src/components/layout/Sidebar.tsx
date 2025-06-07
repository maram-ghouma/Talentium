import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  User,
  History,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Briefcase,
  CalendarCheck,
  ChevronDown,
  Laptop,
  Handshake,
  Shield,
  SwitchCamera,
} from 'lucide-react';
import '../../Styles/sidebar.css';
import { ChatService } from '../../services/Chat/chat.service'; // Adjust path
import { SocketService } from '../../services/Chat/socket.service'; // Adjust path

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  profileName?: string;
  profileRole?: string;
  userType: 'admin' | 'client' | 'freelancer';
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  isDarkMode,
  profileName,
  profileRole,
  userType
}) => {
  const [totalUnread, setTotalUnread] = useState(5); // Static value for Chat badge
  const socketService = new SocketService(); // Replace with dependency injection
  const chatService = new ChatService(socketService);

  const calculateTotalUnread = (contacts: any[]) => {
    const total = contacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0);
    setTotalUnread(total);
  };

  useEffect(() => {
    const contacts = chatService.getContacts();
    calculateTotalUnread(contacts);

    chatService.onContactsUpdate((updatedContacts) => {
      calculateTotalUnread(updatedContacts);
    });

    return () => {
      // Cleanup if ChatService supports removing listeners
    };
  }, [chatService]);

  // Client menu items
  const ClientMenuItems = [
    { icon: Bell, label: 'Notifications', badge: 3, path: "" },
    { icon: CalendarCheck, label: 'Schedule', path: "" },
    { icon: MessageSquare, label: 'Chat', badge: 5, path: "" }, // Static badge value
    { icon: History, label: 'History', path: "" },
  ];

  // Admin menu items
  const AdminMenuItems = [
    { icon: Briefcase, label: 'Dashboard', path: "/admin" }, 
    { icon: Bell, label: 'Notifications', badge: 3, path: "" },
    { icon: Shield, label: 'Reports', path: "/admin/reports" },
  ];

  // Freelancer menu items
  const FreelancerMenuItems = [
    { icon: User, label: 'Profile', path: "/Freelancer/profile" },
    { icon: Bell, label: 'Notifications', badge: 3, path: "/Freelancer" },
    { icon: MessageSquare, label: 'Chat', badge: 5, path: "/Freelancer/chat" }, // Static badge value
    { icon: History, label: 'Work History', path: "/Freelancer/history" },
    { icon: Briefcase, label: 'Missions', path: "/Freelancer" },
  ];

  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const toggleUserDropdown = () => setUserDropdownOpen(prev => !prev);

  const menuItems = userType === 'admin' 
    ? AdminMenuItems 
    : userType === 'client' 
    ? ClientMenuItems 
    : FreelancerMenuItems;

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'} ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="sidebar-content">
        <button
          onClick={toggleSidebar}
          className="toggle-button"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
        
        <div className="logo-section">
          <div className="logo-container1">
            <Briefcase className="logo-icon" size={20} />
          </div>
          {isOpen && (
            <div className="brand-name">
              <span className="brand-text1">Talent</span>
              <span className="brand-highlight">ium</span>
            </div>
          )}
        </div>

        <div className={`profile-section ${isOpen ? '' : 'collapsed'}`}>
          <div className="profile-icon-container">
            <User size={24} className="profile-icon" />
          </div>
          
          {isOpen && (
            <div className="profile-info">
              <h6 className="profile-name">{profileName}</h6>
              <span className="role-text">{profileRole}</span>
            </div>
          )}
        </div>

        <nav className="nav-menu">
          {menuItems.map((item) => (
            <Link to={item.path} style={{ textDecoration: 'none' }} key={item.label}>
              <button className="sidebar-button">
                <div className="icon-container">
                  <item.icon size={20} />
                  {/* Minimal fix: Safely check if badge exists and is greater than 0 */}
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="badge">{item.badge}</span>
                  )}
                </div>
                {isOpen && <span className="button-label">{item.label}</span>}
              </button>
            </Link>
          ))}
          {userType === 'admin' && (
            <div className="sidebar-dropdown">
              <button onClick={toggleUserDropdown} className="sidebar-button">
                <div className="icon-container">
                  <User size={20} />
                </div>
                {isOpen && (
                  <>
                    <span className="button-label">Users</span>
                    <ChevronDown size={16} style={{ marginLeft: 'auto' }} />
                  </>
                )}
              </button>

              {isOpen && userDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/admin/clients" style={{ textDecoration: 'none' }}>
                    <button className="sidebar-button">
                      <div className="icon-container">
                        <Handshake size={20} style={{ marginLeft: '10px' }} />
                      </div>
                      {isOpen && <span className="button-label">Clients</span>}
                    </button>
                  </Link>
                  <Link to="/admin/freelancers" style={{ textDecoration: 'none' }}>
                    <button className="sidebar-button">
                      <div className="icon-container">
                        <Laptop size={20} style={{ marginLeft: '10px' }} />
                      </div>
                      {isOpen && <span className="button-label">Freelancers</span>}
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      <div className="footer-menu">
        {userType === 'admin' && (
          <>
            <button key="sign-out" className="sidebar-button">
              <div className="icon-container">
                <LogOut size={20} />
              </div>
              {isOpen && <span className="button-label">Sign Out</span>}
            </button>
          </>
        )}

        {(userType === 'client' || userType === 'freelancer') && (
          <>
            <button key="switch-profile" className="sidebar-button">
              <div className="icon-container">
                <SwitchCamera size={20} />
              </div>
              {isOpen && <span className="button-label">Switch Profile</span>}
            </button>
            <button key="sign-out" className="sidebar-button">
              <div className="icon-container">
                <LogOut size={20} />
              </div>
              {isOpen && <span className="button-label">Sign Out</span>}
            </button>
          </>
        )}
      </div>
    </div>
  );
};