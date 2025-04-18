import React from 'react';
import { Users, Briefcase } from 'lucide-react';
import '../../Styles/Guest.css'
const RoleSelector = () => {
  return (
    <div className="container my-5 py-5">
      <h2 className="text-center mb-4" style={{ color: 'var(--navy-primary)' }}>Choose Your Path</h2>
      <div className="row justify-content-center gap-4">
        <div className=" mission-card col-md-5 text-center">
          <Users size={48} style={{ color: 'var(--navy-primary)' }} />
          <h3 className="mt-3" style={{ color: 'var(--navy-primary)' }}>Hire Talent</h3>
          <p className="text-muted">Find the perfect freelancer for your project</p>
          <button className="btn w-100" style={{ backgroundColor: 'var(--navy-primary)', color: 'white' }}>
            Post a Job
          </button>
        </div>
        <div className="col-md-5 mission-card text-center">
          <Briefcase size={48} style={{ color: 'var(--navy-primary)' }} />
          <h3 className="mt-3" style={{ color: 'var(--navy-primary)' }}>Find Work</h3>
          <p className="text-muted">Browse jobs that match your expertise</p>
          <button className="btn w-100" style={{ backgroundColor: 'var(--rose)', color: 'white' }}>
            Find Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;