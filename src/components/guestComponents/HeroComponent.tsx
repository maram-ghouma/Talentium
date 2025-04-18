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
            <a className="navbar-brand d-flex align-items-center gap-2 " style={{color: 'white'}} href="#" >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-briefcase "><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <span >FreelanceHub</span></a>
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