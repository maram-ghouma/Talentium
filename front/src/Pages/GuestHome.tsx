import React from 'react';
import Navbar from '../components/guestComponents/HeroComponent';
import RoleSelector from '../components/guestComponents/RoleSelector';
import JobCategories from '../components/guestComponents/JobCategories';
import ContactForm from '../components/guestComponents/ContactForm';
import { ArrowRight } from 'lucide-react';
import HeroComponent from '../components/guestComponents/HeroComponent';

function guestHome() {
  return (
    <div>
      <HeroComponent />
      
      {/* Hero Section */}
      <div style={{ 
        backgroundColor: 'var(--navy-primary)',
        padding: '120px 0 80px',
        color: 'white'
      }}>
        <div className="container text-center">
          <h1 className="display-4 mb-4">Find the Perfect Match for Your Project</h1>
          <p className="lead mb-4">Connect with top freelancers and businesses worldwide</p>
          <div className="search-container mx-auto">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search for any skill or job title..."
            />
            <button className="search-button">
              Search
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <RoleSelector />
      
      <div style={{ backgroundColor: 'var(--powder)', padding: '40px 0' }}>
        <JobCategories />
      </div>
      
      <ContactForm />
    </div>
  );
}

export default guestHome;