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
  ChevronDown,
  Laptop,
  Building,
  Handshake,
} from 'lucide-react';
import '../../Styles/sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  profileName?: string;
  profileRole?: string;
  userType: 'admin' | 'client' | 'freelancer'; // Add userType prop to determine sidebar type
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  isDarkMode,
  profileName ,
  profileRole ,
  userType // Receive the userType (admin or client) prop
}) => {
  // Admin menu items
  const ClientMenuItems = [
    { icon: Bell, label: 'Notifications', badge: 3 },
    { icon: CalendarCheck, label: 'Schedule' },
    { icon: MessageSquare, label: 'Chat', badge: 2 },
    { icon: History, label: 'History' },
  ];

  // Client menu items
  const AdminMenuItems = [
    { icon: Briefcase, label: 'Dashboard' }, 
    { icon: Bell, label: 'Notifications', badge: 3 },
  ];
  const FreelancerMenuItems = [
    { icon: Bell, label: 'Notifications', badge: 3 },
    { icon: MessageSquare, label: 'Chat', badge: 2 },
  ];
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
const toggleUserDropdown = () => setUserDropdownOpen(prev => !prev);

  // Determine which menu to render based on userType
  const menuItems = userType === 'admin' 
  ? AdminMenuItems 
  : userType === 'client' 
  ? ClientMenuItems 
  : FreelancerMenuItems;

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
          {menuItems.map((item) => (
            <button key={item.label} className="sidebar-button">
              <div className="icon-container">
                <item.icon size={20} />
                {item.badge && <span className="badge">{item.badge}</span>}
              </div>
              {isOpen && <span className="button-label">{item.label}</span>}
            </button>
          ))}
            {/* Admin-specific "Users" dropdown */}
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
          <button className="sidebar-button ">
          <div className="icon-container">
                <Handshake size={20} style={{ marginLeft: '10px'}}/>
              </div>
              {isOpen && <span className="button-label">Clients</span>}</button>
              <button className="sidebar-button ">
          <div className="icon-container">
                <Laptop size={20} style={{ marginLeft: '10px'}}/>
              </div>
              {isOpen && <span className="button-label">Freelancers</span>}</button>        </div>
      )}
    </div>
  )}
        </nav>
      </div>

      <div className="footer-menu">
        {/* Admin specific footer items */}
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

        {/* Client specific footer items */}
        {(userType === 'client' || userType === 'freelancer') && (
          <button key="sign-out" className="sidebar-button">
            <div className="icon-container">
              <LogOut size={20} />
            </div>
            {isOpen && <span className="button-label">Sign Out</span>}
          </button>
        )}
      </div>
    </div>
  );
};
