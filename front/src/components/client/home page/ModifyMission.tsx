import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Mission } from '../../../types';
import '../../../Styles/client/createMission.css';
import { useMutation } from '@apollo/client';
import { UPDATE_MISSION } from '../../../graphql/mission';

interface ModifyMissionProps {
  onClose: () => void;
  onSubmit: (mission: Partial<Mission>) => void;
  isDarkMode: boolean;
  mission: Mission;
  onExited?: () => void;
}


export const ModifyMission: React.FC<ModifyMissionProps> = ({ onClose, onSubmit,onExited, isDarkMode, mission }) => {
  const [modifyMission] = useMutation(UPDATE_MISSION);
  const today = new Date().toISOString().split('T')[0];
  const initialDeadline = mission.deadline 
    ? new Date(mission.deadline).toISOString().split('T')[0] 
    : today;
  

const [formData, setFormData] = useState(() => ({
  title: mission.title || '',
  description: mission.description || '',
  price: mission.price ? mission.price.toString() : '',
  skills: mission.requiredSkills?.join(', ') || '',
  deadline: mission.deadline ? new Date(mission.deadline).toISOString().split('T')[0] : today,
}));



  return (
    <>
      <div
  className="backdrop-overlay"
  onClick={onClose}
  style={{
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10000,
    backgroundColor: 'rgba(0,0,0,0.5)' // optional, for dim effect
  }}
/>

      <div
        className={`modal-container ${isDarkMode ? 'dark-mode' : ''}`}
        style={{ zIndex: 100000 }}
      >

        <div className="modal-header" style={{ backgroundColor: isDarkMode ? 'var(--navy-secondary)' : '', margin: '0px 0px 0px 0px', paddingBottom: '20px', paddingTop: '20px', paddingLeft: '20px', paddingRight: '20px' }}>
          <h2 className="modal-title">Modify Mission</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            modifyMission({
            variables: {
              updateMissionInput: {
                id: mission.id,
                title: formData.title,
                description: formData.description,
                deadline: formData.deadline,
                price: Number(formData.price),
                budget:formData.price,
                status: 'not_assigned',
                date: new Date().toISOString().split('T')[0],
                requiredSkills : formData.skills
              ? formData.skills.split(',').map(skill => skill.trim())
              : []
              },
            },
            refetchQueries: ['GetMissions'],
          }).then(() => {
            onClose(); // optionally close modal
          });

          }}
          style={{margin:'0px 0px 0px 0px', paddingBottom:'10px',paddingTop:'20px',paddingLeft:'20px',paddingRight:'20px'}}
        >
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="form-control"
              placeholder="e.g. React, Node.js, UI/UX Design"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="form-control"
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Budget</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};