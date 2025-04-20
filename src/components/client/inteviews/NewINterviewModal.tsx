import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import { Interview } from '../../../types';

interface NewInterviewModalProps {
  onClose: () => void;
  onSubmit: (interview: Omit<Interview, 'id'>) => void;
}

const NewInterviewModal: React.FC<NewInterviewModalProps> = ({onClose, onSubmit }) => {
  const [show, setShow] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [topic, setTopic] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [remindMe, setRemindMe] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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

    // Reset form and close modal
    setCandidateName('');
    setTopic('');
    setScheduledDateTime('');
    setRemindMe(true);
    handleClose();
  };

  const now = new Date();
  const localDateTime = now.toISOString().slice(0, 16);

  return (
    <>
      {show && <div className="backdrop-overlay" onClick={handleClose}></div>}
      <Button 
        onClick={handleShow} 
        className="mb-4" 
        style={{ 
          backgroundColor: 'var(--navy-secondary)', 
          borderColor: 'var(--navy-secondary)' 
        }}
      >
        <Plus size={18} className="me-1" /> New Interview
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Schedule New Interview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="candidateName">
              <Form.Label>Candidate Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter candidate name"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="topic">
              <Form.Label>Interview Topic</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter interview topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="scheduledDateTime">
              <Form.Label>Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                min={localDateTime}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="remindMe">
              <Form.Check
                type="switch"
                label="Remind me"
                checked={remindMe}
                onChange={(e) => setRemindMe(e.target.checked)}
              />
            </Form.Group>

            <Row className="mt-4">
              <Col>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
              </Col>
              <Col className="text-end">
                <Button 
                  type="submit" 
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewInterviewModal;