import React, { useState } from 'react';
import { MapPin, Mail, Phone, Calendar, DollarSign, Clock, Edit, Linkedin, Github, Globe, Twitter } from 'lucide-react';
import { Profile as ProfileType } from '../../types';
import '../../Styles/Freelancer/Profile.css';
import { MainLayout } from '../layout/MainLayout';

interface ProfileProps {
  profile: ProfileType;
  onEdit?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onEdit }) => {
  const {
    name,
    title,
    avatar,
    location,
    email,
    phone,
    bio,
    skills,
    hourlyRate,
    availability,
    joinedDate,
    socialLinks
  } = profile;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric'
    });
  };
 const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  return (
    <MainLayout
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      onSearch={handleSearch}
      usertype="freelancer"
      profileName="Freelancer"
      profileRole=""
    >
    <div className="profile-container">
      <div className="profile-header">
        <img src={avatar} alt={name} className="profile-avatar" />
        
        <div className="profile-header-info">
          <h1 className="profile-name">{name}</h1>
          <h2 className="profile-title">{title}</h2>
          
          <div className="profile-meta">
            <div className="profile-meta-item">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
            
            <div className="profile-meta-item">
              <Mail size={16} />
              <span>{email}</span>
            </div>
            
            <div className="profile-meta-item">
              <Phone size={16} />
              <span>{phone}</span>
            </div>
          </div>
          
          <div className="profile-social">
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="profile-social-link"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={18} />
              </a>
            )}
            
            {socialLinks.github && (
              <a 
                href={socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="profile-social-link"
                aria-label="GitHub profile"
              >
                <Github size={18} />
              </a>
            )}
            
            {socialLinks.portfolio && (
              <a 
                href={socialLinks.portfolio} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="profile-social-link"
                aria-label="Portfolio website"
              >
                <Globe size={18} />
              </a>
            )}
            
            {socialLinks.twitter && (
              <a 
                href={socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="profile-social-link"
                aria-label="Twitter profile"
              >
                <Twitter size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      
      <section className="profile-section">
        <h3 className="profile-section-title">About</h3>
        <p className="profile-bio">{bio}</p>
        
        <div className="profile-info-grid">
          <div className="profile-info-item">
            <div className="profile-info-label">
              <Calendar size={14} /> Member Since
            </div>
            <div className="profile-info-value">{formatDate(joinedDate)}</div>
          </div>
          
          <div className="profile-info-item">
            <div className="profile-info-label">
              <DollarSign size={14} /> Hourly Rate
            </div>
            <div className="profile-info-value">${hourlyRate.toFixed(2)}/hr</div>
          </div>
          
          <div className="profile-info-item">
            <div className="profile-info-label">
              <Clock size={14} /> Availability
            </div>
            <div className="profile-info-value">{availability}</div>
          </div>
        </div>
        
        <h3 className="profile-section-title">Skills</h3>
        <div className="profile-skills">
          {skills.map((skill, index) => (
            <span key={index} className="profile-skill">{skill}</span>
          ))}
        </div>
        
        {onEdit && (
          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={onEdit}>
              <Edit size={16} /> Edit Profile
            </button>
          </div>
        )}
      </section>
    </div>
    </MainLayout>
  );
};

export default Profile;