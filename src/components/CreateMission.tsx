import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Mission } from '../types';
interface CreateMissionProps {
  onClose: () => void;
  onSubmit: (mission: Partial<Mission>) => void;
  isDarkMode: boolean;
}

export const CreateMission: React.FC<CreateMissionProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  return (
    <div className="glass-effect">
      <div className="create-mission-modal">
        <div className="modal-header">
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
        >
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Budget</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="form-control"
            />
          </div>

          <button type="submit" className="submit-button">
            Create Mission
          </button>
        </form>
      </div>
    </div>
  );
};