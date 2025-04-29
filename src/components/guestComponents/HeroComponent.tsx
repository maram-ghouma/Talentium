import React, { useState, useEffect } from 'react';
import { Briefcase, Menu, X, Search, Bell, User } from 'lucide-react';

const HeroComponent: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    } ${darkMode ? 'dark-mode' : ''}`}>
      
          <nav className="navbar navbar-expand-lg fixed-top" style={{
            backgroundColor: 'var(--navy-primary)'}}>
          <div className="container">
          <div className="logo-container">
            <Briefcase className="logo-icon" size={20} />
          </div>              
            <div className="brand-name">
                    <span className="brand-text">Talent</span>
                    <span className="brand-highlight">ium</span>
                  </div>
                
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                   <li className="nav-item"><button className="btn" style={{
      backgroundColor: 'var(--powder)',
      color: 'var(--navy-primary)',
      marginRight: '10px'}}>Log In</button></li>
                   <li className="nav-item"><button className="btn"   style={{
      backgroundColor: 'var(--rose)',
      color: 'white'
    }}>Sign Up</button></li>
                   </ul>
                   </div>
                </div>
                </nav>
 
          </nav>
  );
};

export default HeroComponent;