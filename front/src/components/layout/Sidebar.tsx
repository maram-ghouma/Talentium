import React from 'react';
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
import { report } from 'process';

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
    { icon: Bell, label: 'Notifications', badge: 3, path: "" },
    { icon: CalendarCheck, label: 'Schedule', path: "" },
    { icon: MessageSquare, label: 'Chat', badge: 2 , path: ""},
    { icon: History, label: 'History',path: "" },

  ];

  // Client menu items
  const AdminMenuItems = [
    { icon: Briefcase, label: 'Dashboard' ,path: "/admin"}, 
    { icon: Bell, label: 'Notifications', badge: 3,path: "" },
    { icon: Shield, label: 'Reports',path: "/admin/reports" },

  ];
  const FreelancerMenuItems = [
    { icon: User, label: 'Profile', path: "/Freelancer/profile" },
    { icon: Bell, label: 'Notifications', badge: 3, path: "/Freelancer" },
    { icon: MessageSquare, label: 'Chat', badge: 2, path: "/Freelancer/chat" },
    { icon: History, label: 'Work History', path: "/Freelancer/history" },
    { icon: Briefcase, label: 'Missions', path: "/Freelancer" },
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
          <div className="logo-container1">
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
              <h6 className="profile-name">{profileName}</h6>
              <span className="role-text">{profileRole}</span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <Link to= {item.path} style={{ textDecoration: 'none'}}>

            <button key={item.label} className="sidebar-button">
              <div className="icon-container">
                <item.icon size={20} />
                {item.badge && <span className="badge">{item.badge}</span>}
              </div>
              {isOpen && <span className="button-label">{item.label}</span>}
            </button>
            </Link>
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
           <Link to="/admin/clients" style={{ textDecoration: 'none'}}>
          <button className="sidebar-button ">
          <div className="icon-container">
                <Handshake size={20} style={{ marginLeft: '10px'}}/>
              </div>
              {isOpen && <span className="button-label">Clients</span>}</button>
          </Link>
          <Link to="/admin/freelancers" style={{ textDecoration: 'none'}}>

              <button className="sidebar-button ">
          <div className="icon-container">
                <Laptop size={20} style={{ marginLeft: '10px'}}/>
              </div>
              {isOpen && <span className="button-label">Freelancers</span>}</button>  
              </Link>   
             </div>
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
          <>
          <button key="sign-out" className="sidebar-button">
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
