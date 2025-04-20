import React from 'react';
import { Star, MapPin, Mail, Phone, Award, DollarSign, Briefcase } from 'lucide-react';
import { currentUser, workHistory } from '../../Data/mockData';
import WorkHistoryItem from './History';
import '../../Styles/Freelancer/profile.css';


const Profile: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 flex flex-col items-center mb-6 md:mb-0">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img 
                src={currentUser.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center mb-2">
              <Star size={18} className="text-yellow-500 mr-1" />
              <span className="font-semibold">{currentUser.rating}</span>
              <span className="text-slate-500 ml-1 dark:text-slate-400">({currentUser.completedMissions} reviews)</span>
            </div>
            
            <button className="btn-primary w-full mt-2">Edit Profile</button>
          </div>
          
          <div className="md:w-3/4 md:pl-8">
            <h2 className="text-2xl font-bold mb-2">{currentUser.name}</h2>
            <h3 className="text-lg text-slate-600 dark:text-slate-300 mb-4">{currentUser.role}</h3>
            
            <p className="mb-6 text-slate-700 dark:text-slate-300">
              {currentUser.bio}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <Mail size={18} className="mr-2 text-slate-500" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <Phone size={18} className="mr-2 text-slate-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <MapPin size={18} className="mr-2 text-slate-500" />
                <span>New York, USA</span>
              </div>
              <div className="flex items-center text-slate-700 dark:text-slate-300">
                <DollarSign size={18} className="mr-2 text-slate-500" />
                <span>${currentUser.hourlyRate}/hr</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <Award size={18} className="mr-2" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills?.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm dark:bg-slate-700 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Briefcase size={20} className="mr-2" />
          Work History
        </h3>
        
        <div className="space-y-6">
          {workHistory.map(item => (
            <WorkHistoryItem key={item.id} historyItem={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;