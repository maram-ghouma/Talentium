import React from 'react';
import {
  Bell,
  User,
  History,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  Repeat,
  Briefcase,
  CalendarCheck,
} from 'lucide-react';
import '../../Styles/sidebar.css';
interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  profileName?: string;
  profileRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  isDarkMode,
  profileName = "Alex Morgan",
  profileRole = "UI/UX Designer"
}) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'} ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="sidebar-content">
        {/* Toggle Button - Moved to top */}
        <button
          onClick={toggleSidebar}
          className="toggle-button"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
        
        {/* Logo and Brand Section */}
        <div className="logo-section">
          <div className="logo-container">
            <Briefcase className="logo-icon" size={20} />
          </div>
          {isOpen && (
            <div className="brand-name">
              <span className="brand-text">Talent</span>
              <span className="brand-highlight">ium</span>
            </div>
          )}
        </div>

        {/* Profile Section with Icon */}
        <div className={`profile-section ${isOpen ? '' : 'collapsed'}`}>
          <div className="profile-icon-container">
            <User size={24} className="profile-icon" />
          </div>
          
          {isOpen && (
            <div className="profile-info">
              <h4 className="profile-name">{profileName}</h4>
              <span className="role-text">{profileRole}</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          {[
            { icon: Bell, label: 'Notifications', badge: 3 },
            { icon: CalendarCheck, label: 'Schedule'},
            { icon: MessageSquare, label: 'Chat', badge: 2 },
            { icon: History, label: 'History' },
          ].map((item) => (
            <button key={item.label} className="sidebar-button">
              <div className="icon-container">
                <item.icon size={20} />
                {item.badge && <span className="badge">{item.badge}</span>}
              </div>
              {isOpen && <span className="button-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="footer-menu">
        {[
          { icon: Repeat, label: 'Switch Role' },
          { icon: LogOut, label: 'Sign Out' },
        ].map((item) => (
          <button key={item.label} className="sidebar-button">
            <div className="icon-container">
              <item.icon size={20} />
            </div>
            {isOpen && <span className="button-label">{item.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};