import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Mission } from '../../../types';
import '../../../Styles/client/createMission.css';
interface CreateMissionProps {
  onClose: () => void;
  onSubmit: (mission: Partial<Mission>) => void;
  isDarkMode: boolean;
}

export const CreateMission: React.FC<CreateMissionProps> = ({ onClose, onSubmit, isDarkMode }) => {
const today = new Date().toISOString().split('T')[0];
const [formData, setFormData] = useState({
  title: '',
  description: '',
  price: '',
  skills: '',
  deadline: today,
});



  return (
    <>
      {/* Separate blurred background overlay */}
      <div className="backdrop-overlay" onClick={onClose}></div>
      
      {/* Modal content - completely separate from the blurred overlay */}
      <div className={`modal-container ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="modal-header" style={{ backgroundColor: isDarkMode ? 'var(--navy-secondary)' : '' ,margin:'0px 0px 0px 0px', paddingBottom:'20px',paddingTop:'20px',paddingLeft:'20px',paddingRight:'20px'}}>
          <h2 className="modal-title">Create New Mission</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              ...formData,
              price: Number(formData.price),
              status: 'not_assigned',
              date: new Date().toISOString(),
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
    value={formData.skills || ''}
    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
    className="form-control"
    placeholder="e.g. React, Node.js, UI/UX Design"
  />
</div>

<div className="form-group">
  <label className="form-label">Deadline</label>
  <input
    type="date"
    value={formData.deadline || ''}
    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
    className="form-control"
    min={new Date().toISOString().split('T')[0]} // Sets min date to today
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
            Create Mission
          </button>
        </form>
      </div>
    </>
  );
};