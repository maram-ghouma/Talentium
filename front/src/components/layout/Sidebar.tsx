import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  DollarSign,
  Home,
} from 'lucide-react';
import '../../Styles/sidebar.css';
import { report } from 'process';
import { signOut, SwitchProfile } from '../../services/userService';
import { on } from 'events';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  profileName?: string;
  profileRole?: string;
  userType: 'admin' | 'client' | 'freelancer'; 
  onRoleChange: (newRole: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  isDarkMode,
  profileName ,
  profileRole ,
  userType, 
  onRoleChange,
}) => {
  // Client menu items
  const ClientMenuItems = [
    { icon: Home, label: 'Home', path: "/client" },
    { icon: User, label: 'Profile', path: "/client/editProfile" },
    { icon: Bell, label: 'Notifications', badge: 3, path: "/notifications" },
    { icon: CalendarCheck, label: 'Schedule', path: "/client/interviews" },
    { icon: MessageSquare, label: 'Chat', badge: 2 , path: "/client/chat" },

  ];

  // Admin menu items
  const AdminMenuItems = [
    { icon: Briefcase, label: 'Dashboard' ,path: "/admin"}, 
    { icon: Bell, label: 'Notifications', badge: 3,path: "/notifications" },
    { icon: Shield, label: 'Reports',path: "/admin/reports" },
    { icon: DollarSign, label: 'Payment',path: "/jalons" },


  ];
  const FreelancerMenuItems = [
    { icon: Home, label: 'Home', path: "/Freelancer" },
    { icon: User, label: 'Profile', path: "/Freelancer/editProfile" },
    { icon: Bell, label: 'Notifications', badge: 3, path: "/Freelancer" },
    { icon: MessageSquare, label: 'Chat', badge: 2, path: "/Freelancer/chat" },
    { icon: History, label: 'Work History', path: "/Freelancer/history" },
  ];
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
const toggleUserDropdown = () => setUserDropdownOpen(prev => !prev);

  // Determine which menu to render based on userType
  const menuItems = profileRole === 'admin' 
  ? AdminMenuItems 
  : profileRole === 'client' 
  ? ClientMenuItems 
  : FreelancerMenuItems;

  const [loading, setLoading] = useState(false);

  const handleSwitch = async () => {
    const newRole = profileRole === 'client' ? 'freelancer' : 'client';
    try {
      setLoading(true);
      const updatedUser = await SwitchProfile(newRole);
      localStorage.setItem('authToken', updatedUser.access_token);
      console.log('Profile switched successfully:', updatedUser);
      toast.success(`Switched to ${newRole} successfully!`);
      onRoleChange(updatedUser.currentRole); 
    } catch (err) {
      console.error(err);
      toast.error('Failed to switch profile');
    } finally {
      setLoading(false);
    }
  };
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
              <span className="brand-text1">Talent</span>
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
  {profileRole === 'admin' && (
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
        {profileRole === 'admin' && (
          <>
            <button key="sign-out" className="sidebar-button" onClick={signOut}>
              <div className="icon-container">
                <LogOut size={20} />
              </div>
              {isOpen && <span className="button-label">Sign Out</span>}
            </button>
          </>
        )}

        {/* Client specific footer items */}
        {(profileRole === 'client' || profileRole === 'freelancer') && (
          <>
          <button key="sign-out" className="sidebar-button" onClick={handleSwitch} disabled={loading}>
            <div className="icon-container">
              <SwitchCamera size={20} />
            </div>
            {isOpen && <span className="button-label">Switch to {profileRole === 'client' ? 'Freelancer' : 'Client'}</span>}
          </button>
          <button key="sign-out" className="sidebar-button" onClick={signOut}>
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
