import React from 'react';
import { Mail, Phone, MessageSquare } from 'lucide-react';

const ContactForm = () => {
  return (
    <div className="py-5" style={{ backgroundColor: 'var(--navy-primary)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="mission-card">
              <h2 className="text-center mb-4" style={{ color: 'var(--navy-primary)' }}>Get in Touch</h2>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" className="form-control" placeholder="Your Name" />
                  </div>
                  <div className="col-md-6">
                    <input type="email" className="form-control" placeholder="Your Email" />
                  </div>
                  <div className="col-12">
                    <input type="text" className="form-control" placeholder="Subject" />
                  </div>
                  <div className="col-12">
                    <textarea className="form-control" rows={5} placeholder="Your Message"></textarea>
                  </div>
                  <div className="col-12 text-center">
                    <button type="submit" className="btn" style={{ backgroundColor: 'var(--navy-primary)', color: 'white', padding: '10px 30px' }}>
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;