import React from 'react';
import { Code, Palette, Camera, Edit, Globe, Database } from 'lucide-react';

const categories = [
  { icon: <Code size={32} />, title: 'Development', count: '2,534 jobs' },
  { icon: <Palette size={32} />, title: 'Design', count: '1,826 jobs' },
  { icon: <Camera size={32} />, title: 'Photography', count: '943 jobs' },
  { icon: <Edit size={32} />, title: 'Writing', count: '1,429 jobs' },
  { icon: <Globe size={32} />, title: 'Translation', count: '634 jobs' },
  { icon: <Database size={32} />, title: 'Data Science', count: '892 jobs' }
];

const JobCategories = () => {
  return (
    <div className="container my-5" >
      <h2 className="text-center mb-4" style={{ color: 'var(--navy-primary)' }}>Popular Categories</h2>
      <div className="row g-4">
        {categories.map((category, index) => (
          <div key={index} className="col-md-4">
            <div className="mission-card h-100">
              <div className="d-flex align-items-center gap-3">
                <div style={{ color: 'var(--navy-primary)' }}>{category.icon}</div>
                <div>
                  <h4 className="mb-1" style={{ color: 'var(--navy-primary)' }}>{category.title}</h4>
                  <p className="mb-0" style={{ color: 'var(--slate)' }}>{category.count}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobCategories;