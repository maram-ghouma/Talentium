import React, { ReactNode, useState } from 'react';
import { Sun, Moon, User } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import '../../Styles/layout.css';
interface MainLayoutProps {
  children: ReactNode;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  pageTitle?: string;
  hideSearchBar?: boolean;
  onSearch?: (query: string) => void;
  usertype:  'admin' | 'client' | 'freelancer';
  profileName;
  profileRole 
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isDarkMode,
  toggleDarkMode,
  isSidebarOpen,
  toggleSidebar,
  pageTitle,
  profileName ,
  profileRole ,
  hideSearchBar = false,
  onSearch = (query) => console.log(query),
  usertype,
}) => {
  return (
    <div className={isDarkMode ? 'dark-mode' : ''} style={{height:'100%', width:'100%'}}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        isDarkMode={isDarkMode} 
        userType= {usertype}
        profileName= {profileName}
        profileRole={profileRole}
      />

      <main style={{ 
        marginLeft: isSidebarOpen ? '260px' : '80px',
        transition: 'margin-left 0.3s ease',
        height:'100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header section with search bar and profile */}
        <div className="header-section" style={{ padding: '1rem 2rem' }}>
          {pageTitle && (
            <h1 className={`page-title mb-4 ${isDarkMode ? 'text-light' : 'text-dark'}`}>
              {pageTitle}
            </h1>
          )}
          
          <div className="d-flex justify-content-between align-items-center mb-4">
            {!hideSearchBar && (
              <SearchBar onSearch={onSearch} isDarkMode={isDarkMode} />
            )}
            
            <div className="d-flex align-items-center">
              <div className="profile-container me-3">
                {usertype === 'admin' ? (
                    <div>
                    </div>
                  ) : (
                    <div className="profile-picture-wrapper">

                    <img 
                      src="/api/placeholder/32/32" 
                      alt="Profile" 
                      className="profile-picture" 
                    />
                    </div>
                  )}
                 
              </div>
              
              <button
                onClick={toggleDarkMode}
                className="search-button"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="content-section" style={{ 
          padding: '0 2rem 2rem',
          flexGrow: 1,
          overflowY: 'auto'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
};