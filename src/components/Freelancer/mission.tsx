import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, DollarSign, Clock, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { missions } from '../../data/mockData';
import StatusBadge from '../shared/StatusBadge';

const MissionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  
  // Find the mission or redirect/show not found
  const mission = missions.find(m => m.id === id);
  
  if (!mission) {
    return <div className="text-center py-10">Mission not found</div>;
  }
  
  const milestones = [
    { id: 'm1', title: 'Initial consultation', completed: true, date: '10/01/2024' },
    { id: 'm2', title: 'Requirements gathering', completed: true, date: '15/01/2024' },
    { id: 'm3', title: 'Design mockups', completed: mission.status !== 'not assigned', date: '25/01/2024' },
    { id: 'm4', title: 'Finalize design', completed: false, date: '05/02/2024' },
    { id: 'm5', title: 'Implementation', completed: false, date: '20/02/2024' },
    { id: 'm6', title: 'Testing and feedback', completed: false, date: '01/03/2024' },
    { id: 'm7', title: 'Final delivery', completed: false, date: mission.deadline }
  ];
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{mission.title}</h2>
            <p className="text-slate-600 dark:text-slate-300">Client: {mission.clientName}</p>
          </div>
          <StatusBadge status={mission.status} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-slate-700 dark:text-slate-300">
            <Calendar size={18} className="mr-2 text-slate-500" />
            <span>Deadline: {mission.deadline}</span>
          </div>
          <div className="flex items-center text-slate-700 dark:text-slate-300">
            <DollarSign size={18} className="mr-2 text-slate-500" />
            <span>Budget: ${mission.budget}</span>
          </div>
          <div className="flex items-center text-slate-700 dark:text-slate-300">
            <Clock size={18} className="mr-2 text-slate-500" />
            <span>Est. Duration: 4 weeks</span>
          </div>
        </div>
        
        <div className="border-b mb-6 dark:border-slate-700">
          <div className="flex space-x-6">
            <button 
              className={`pb-3 px-1 font-medium ${activeTab === 'details' ? 'border-b-2 border-[#3A4B6D] text-[#3A4B6D] dark:text-white' : 'text-slate-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button 
              className={`pb-3 px-1 font-medium ${activeTab === 'milestones' ? 'border-b-2 border-[#3A4B6D] text-[#3A4B6D] dark:text-white' : 'text-slate-500'}`}
              onClick={() => setActiveTab('milestones')}
            >
              Milestones
            </button>
            <button 
              className={`pb-3 px-1 font-medium ${activeTab === 'attachments' ? 'border-b-2 border-[#3A4B6D] text-[#3A4B6D] dark:text-white' : 'text-slate-500'}`}
              onClick={() => setActiveTab('attachments')}
            >
              Attachments
            </button>
          </div>
        </div>
        
        {activeTab === 'details' && (
          <div>
            <h3 className="font-semibold mb-3">Description</h3>
            <p className="text-slate-700 mb-6 dark:text-slate-300">
              {mission.description}
              <br /><br />
              Additional details about this mission would be displayed here. Information like project scope, 
              deliverables, specific requirements, and any additional context that would help the freelancer 
              understand the project better.
            </p>
            
            <h3 className="font-semibold mb-3">Requirements</h3>
            <ul className="list-disc pl-5 text-slate-700 mb-6 dark:text-slate-300">
              <li>Requirement 1 for this mission</li>
              <li>Requirement 2 for this mission</li>
              <li>Requirement 3 for this mission</li>
              <li>Requirement 4 for this mission</li>
            </ul>
            
            <div className="flex space-x-4 mt-6">
              <button className="btn-primary">
                <MessageSquare size={18} className="mr-2" />
                Contact Client
              </button>
              
              {mission.status === 'not assigned' ? (
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 flex items-center">
                  <CheckCircle size={18} className="mr-2" />
                  Accept Mission
                </button>
              ) : mission.status === 'in progress' ? (
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 flex items-center">
                  <CheckCircle size={18} className="mr-2" />
                  Mark as Completed
                </button>
              ) : (
                <button className="bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 flex items-center" disabled>
                  <CheckCircle size={18} className="mr-2" />
                  Completed
                </button>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'milestones' && (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex items-start">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${milestone.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                  {milestone.completed ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className={`ml-3 pb-4 ${index < milestones.length - 1 ? 'border-l-2 border-slate-200 dark:border-slate-700 pl-5' : 'pl-5'}`}>
                  <div className="font-medium">{milestone.title}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Due: {milestone.date}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'attachments' && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-md p-3 flex items-center dark:border-slate-700">
                <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                  <span className="font-medium">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">project_brief.pdf</div>
                  <div className="text-sm text-slate-500">548 KB</div>
                </div>
              </div>
              
              <div className="border rounded-md p-3 flex items-center dark:border-slate-700">
                <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center text-green-500 mr-3">
                  <span className="font-medium">XLS</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">budget_breakdown.xlsx</div>
                  <div className="text-sm text-slate-500">235 KB</div>
                </div>
              </div>
              
              <div className="border rounded-md p-3 flex items-center dark:border-slate-700">
                <div className="w-10 h-10 rounded bg-amber-100 flex items-center justify-center text-amber-500 mr-3">
                  <span className="font-medium">IMG</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">reference_design.jpg</div>
                  <div className="text-sm text-slate-500">1.2 MB</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionDetails;