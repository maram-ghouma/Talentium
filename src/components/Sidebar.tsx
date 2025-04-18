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
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div>
        <button
          onClick={toggleSidebar}
          className="sidebar-button mb-4 justify-content-end"
        >
          {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        <nav className="d-flex flex-column gap-4">
          {[
            { icon: Bell, label: 'Notifications' },
            { icon: User, label: 'Profile' },
            { icon: History, label: 'History' },
            { icon: MessageSquare, label: 'Chat' },
          ].map((item) => (
            <button key={item.label} className="sidebar-button">
              <item.icon size={24} />
              {isOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="d-flex flex-column gap-2">
        {[
          { icon: Repeat, label: 'Switch Role' },
          { icon: LogIn, label: 'Sign In' },
          { icon: LogOut, label: 'Sign Out' },
        ].map((item) => (
          <button key={item.label} className="sidebar-button">
            <item.icon size={24} />
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};