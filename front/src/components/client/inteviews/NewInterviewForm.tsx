import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { Interview } from '../../../types';

interface NewInterviewFormProps {
  onSubmit: (interview: Omit<Interview, 'id'>) => void;
}

const NewInterviewForm: React.FC<NewInterviewFormProps> = ({ onSubmit }) => {
  const [candidateName, setCandidateName] = useState('');
  const [topic, setTopic] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [remindMe, setRemindMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!candidateName || !topic || !scheduledDateTime) {
      return;
    }

    onSubmit({
      candidateName,
      topic,
      scheduledDateTime,
      remindMe,
    });

    setCandidateName('');
    setTopic('');
    setScheduledDateTime('');
    setRemindMe(true);
  };

  const now = new Date();
  const localDateTime = now.toISOString().slice(0, 16);

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row>
        <Col md={6} className="mb-3">
          <Form.Group controlId="candidateName">
            <Form.Label>Candidate Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter candidate name"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Group controlId="topic">
            <Form.Label>Interview Topic</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter interview topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-3">
          <Form.Group controlId="scheduledDateTime">
            <Form.Label>Date and Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              min={localDateTime}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3 d-flex align-items-end">
          <Form.Group controlId="remindMe" className="mb-3 mb-md-0">
            <Form.Check
              type="switch"
              label="Remind me"
              checked={remindMe}
              onChange={(e) => setRemindMe(e.target.checked)}
            />
          </Form.Group>
          <Button 
            type="submit" 
            className="ms-auto" 
            style={{ 
              backgroundColor: 'var(--navy-secondary)', 
              borderColor: 'var(--navy-secondary)' 
            }}
          >
            Schedule Interview
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default NewInterviewForm;