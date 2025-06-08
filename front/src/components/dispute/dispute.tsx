import React, { useState } from 'react';
import { AlertCircle, Send, X } from 'lucide-react';
import './dispute.css'; 

type Mission = {
  id: number;
  title: string;
  // Add other fields if needed
};

type DisputeStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';

type DisputeFormData = {
  mission?: Mission;
  reason: string;
  status: DisputeStatus;
  resolution?: string;
};

type DisputeFormProps = {
  missions?: Mission[];
  //onSubmit: (data: any) => void;
  onCancel?: () => void;
  initialData?: DisputeFormData | null;
  isLoading?: boolean;
};

const DisputeForm: React.FC<DisputeFormProps> = ({ 
  missions = [], 
  //onSubmit, 
  onCancel, 
  initialData = null,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    missionId: initialData?.mission?.id || '',
    reason: initialData?.reason || '',
    status: initialData?.status || 'OPEN',
    resolution: initialData?.resolution || ''
  });

  type DisputeFormErrors = {
    missionId?: string;
    reason?: string;
    resolution?: string;
  };

  const [errors, setErrors] = useState<DisputeFormErrors>({});

  const disputeStatuses = [
    { value: 'OPEN', label: 'Open', className: 'open' },
    { value: 'IN_REVIEW', label: 'In Review', className: 'in-review' },
    { value: 'RESOLVED', label: 'Resolved', className: 'resolved' },
    { value: 'REJECTED', label: 'Rejected', className: 'rejected' }
  ];

  const validateForm = () => {
    const newErrors: DisputeFormErrors = {};

    if (!formData.missionId) {
      newErrors.missionId = 'Mission is required';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason is required';
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters long';
    }

    if (formData.status === 'RESOLVED' && !formData.resolution.trim()) {
      newErrors.resolution = 'Resolution is required when status is Resolved';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        missionId: parseInt(String(formData.missionId)),
        resolution: formData.resolution.trim() || null
      };
      
      //onSubmit(submitData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const isEditing = !!initialData;

  return (
    <div className="dispute-form-container">
      <div className="dispute-form-header">
        <div className="dispute-form-header-content">
          <h2 className="dispute-form-title">
            {isEditing ? 'Edit Dispute' : 'Create New Dispute'}
          </h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className="dispute-form-close-btn"
            >
              <X className="dispute-form-close-icon" />
            </button>
          )}
        </div>
      </div>

      <div className="dispute-form-body">
        <div className="dispute-form-space">
          {/* Mission Selection */}
          <div className="form-group">
            <label htmlFor="mission" className="form-label">
              Mission *
            </label>
            <select
              id="mission"
              value={formData.missionId}
              onChange={(e) => handleInputChange('missionId', e.target.value)}
              className={`form-select ${errors.missionId ? 'error' : ''}`}
              disabled={isEditing || isLoading}
            >
              <option value="">Select a mission</option>
              {missions.map(mission => (
                <option key={mission.id} value={mission.id}>
                  {mission.title} (ID: {mission.id})
                </option>
              ))}
            </select>
            {errors.missionId && (
              <div className="error-message">
                <AlertCircle className="error-icon" />
                {errors.missionId}
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="form-group">
            <label htmlFor="reason" className="form-label">
              Reason *
            </label>
            <textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className={`form-textarea ${errors.reason ? 'error' : ''}`}
              placeholder="Describe the reason for this dispute..."
              disabled={isLoading}
            />
            <div className="form-footer">
              <div>
                {errors.reason && (
                  <div className="error-message">
                    <AlertCircle className="error-icon" />
                    {errors.reason}
                  </div>
                )}
              </div>
              <span className="character-count">
                {formData.reason.length} characters
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">
              Status
            </label>
            <div className="status-grid">
              {disputeStatuses.map(status => (
                <label
                  key={status.value}
                  className={`status-option ${formData.status === status.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={formData.status === status.value}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="status-radio"
                    disabled={isLoading}
                  />
                  <div className="status-content">
                    <span className={`status-badge ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Resolution (conditional) */}
          {(formData.status === 'RESOLVED' || formData.status === 'REJECTED') && (
            <div className="form-group">
              <label htmlFor="resolution" className="form-label">
                Resolution {formData.status === 'RESOLVED' ? '*' : ''}
              </label>
              <textarea
                id="resolution"
                value={formData.resolution}
                onChange={(e) => handleInputChange('resolution', e.target.value)}
                className={`form-textarea small ${errors.resolution ? 'error' : ''}`}
                placeholder="Provide details about the resolution..."
                disabled={isLoading}
              />
              {errors.resolution && (
                <div className="error-message">
                  <AlertCircle className="error-icon" />
                  {errors.resolution}
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Send className="btn-icon" />
                  {isEditing ? 'Update Dispute' : 'Create Dispute'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeForm;