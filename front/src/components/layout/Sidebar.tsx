import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate} from 'react-router-dom';

import {
  Bell,
  User,
  History,
  MessageSquare, // Make sure MessageSquare is imported
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
import { ChatService } from '../../services/Chat/chat.service'; // Adjust path
import { SocketService } from '../../services/Chat/socket.service'; // Adjust path
import { NotificationService } from '../../services/Notification/notification.service'; // Import your NotificationService
import { signOut, SwitchProfile } from '../../services/userService';

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
  profileName,
  profileRole,
  userType,
  onRoleChange,
}) => {
  // Renamed for clarity: totalUnreadChat for messages, unreadNotificationCount for notifications
  const [totalUnreadChat, setTotalUnreadChat] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  // Initialize ChatService and NotificationService
  const [chatService, setChatService] = useState<ChatService | null>(null);
  const [notificationService, setNotificationService] = useState<NotificationService | null>(null);

  useEffect(() => {
    // Initialize SocketService for ChatService
    const socketServiceInstance = new SocketService();
    const chatServiceInstance = new ChatService(socketServiceInstance);
    setChatService(chatServiceInstance);

    // Initialize NotificationService with token
    const token = localStorage.getItem('authToken');
    if (token) {
      setNotificationService(new NotificationService(token));
    }

    // Cleanup function
    return () => {
      socketServiceInstance.disconnect(); // Disconnect chat socket on unmount
      if (notificationService) {
        notificationService.disconnect(); // Disconnect notification socket on unmount
      }
    };
  }, []); // Run once on component mount

  // Effect for Chat Unread Count
  useEffect(() => {
    if (chatService) {
      // Get initial unread count
      const initialContacts = chatService.getContacts();
      const initialChatUnread = initialContacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0);
      setTotalUnreadChat(initialChatUnread);

      // Subscribe to updates from ChatService
      const unsubscribeChat = (updatedContacts: any[]) => {
        const updatedChatUnread = updatedContacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0);
        setTotalUnreadChat(updatedChatUnread);
      };
      chatService.onContactsUpdate(unsubscribeChat);

      return () => {
        // ChatService doesn't expose an 'off' method for contacts,
        // but the listener is associated with the instance which is
        // discarded on unmount. If ChatService were a singleton,
        // you'd need to properly remove the listener.
      };
    }
  }, [chatService]); // Re-run if chatService instance changes

  // Effect for Notification Unread Count
  useEffect(() => {
    if (notificationService) {
      // Subscribe to notification updates
      const unsubscribeNotifications = notificationService.onNotificationsUpdate((notifications) => {
        setUnreadNotificationCount(notifications.length);
      });

      // Fetch initial unread notifications
      notificationService.getUnreadNotifications().then((notifications) => {
        setUnreadNotificationCount(notifications.length);
      });

      return () => {
        unsubscribeNotifications(); // Unsubscribe on component unmount
      };
    }
  }, [notificationService]); // Re-run if notificationService instance changes


  // Client menu items
  const ClientMenuItems = [
    { icon: Home, label: 'Home', path: "/client" },
    { icon: User, label: 'Profile', path: "/client/editProfile" },
    { icon: Bell, label: 'Notifications', badge: unreadNotificationCount, path: "/notifications" }, // Dynamic badge
    { icon: CalendarCheck, label: 'Schedule', path: "/client/interviews" },
    { icon: MessageSquare, label: 'Chat', badge: totalUnreadChat, path: "/client/chat" }, // Dynamic badge for chat
    { icon: History, label: 'History', path: "" },
  ];

  // Admin menu items
  const AdminMenuItems = [
    { icon: Briefcase, label: 'Dashboard', path: "/admin" },
    { icon: Bell, label: 'Notifications', badge: unreadNotificationCount, path: "/notifications" }, // Dynamic badge
    { icon: Shield, label: 'Reports', path: "/admin/reports" },
    { icon: DollarSign, label: 'Payment', path: "/jalons" },
  ];

  // Freelancer menu items
  const FreelancerMenuItems = [
    { icon: Home, label: 'Home', path: "/Freelancer" },
    { icon: User, label: 'Profile', path: "/Freelancer/editProfile" },

    { icon: Bell, label: 'Notifications', badge: unreadNotificationCount, path: "/notifications" }, // Dynamic badge
    { icon: MessageSquare, label: 'Chat', badge: totalUnreadChat, path: "/Freelancer/chat" }, // Dynamic badge for chat
    { icon: History, label: 'Work History', path: "/Freelancer/history" },
    { icon: CalendarCheck, label: 'Schedule', path: "/freelancer/interviews" },
  ];

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const toggleUserDropdown = () => setUserDropdownOpen(prev => !prev);

  // Determine which menu to render based on profileRole
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
                  {/* Safely check if badge exists and is greater than 0 */}
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="badge">{item.badge}</span>
                  )}
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