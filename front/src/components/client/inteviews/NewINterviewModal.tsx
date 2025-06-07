import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Plus } from 'lucide-react';
import { Interview } from '../../../types';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_INTERVIEW } from '../../../graphql/interviews';
import { useLocation } from 'react-router-dom';
import { GET_ALL_FREELANCERS } from '../../../graphql/application';

interface NewInterviewModalProps {
  onClose: () => void;
  onSubmit: (interview: Omit<Interview, 'id'>) => void;
}

const NewInterviewModal: React.FC<NewInterviewModalProps> = ({onClose, onSubmit }) => {
      const location = useLocation();
    const [type, setType] = useState('');

  useEffect(() => {
    if (location.pathname === '/client/interviews') {
      setType('client');
    } else if (location.pathname === '/freelancer/interviews') {
      setType('freelancer');
    }
  }, [location.pathname]);
  const [show, setShow] = useState(false);
  const [freelancerId, setFreelancerId] = useState('');

  const [topic, setTopic] = useState('');
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [remindMe, setRemindMe] = useState(true);

  const [createInterview] = useMutation(CREATE_INTERVIEW, {
    onCompleted: () => {
     setFreelancerId('');
      setTopic('');
      setScheduledDateTime('');
      setRemindMe(true);
      handleClose();
    },
    onError: (error) => {
      console.error('Error creating interview:', error);
    },
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic || !scheduledDateTime) return;

    createInterview({
      variables: {
        input: {
          freelancerId: Number(freelancerId), 
          topic,
          scheduledDateTime,
          remindMe,
        },
      },
    });
  };
/*
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

    setCandidateName('');
    setTopic('');
    setScheduledDateTime('');
    setRemindMe(true);
    handleClose();
  };*/

  const now = new Date();
  const localDateTime = now.toISOString().slice(0, 16);
  const { data } = useQuery(GET_ALL_FREELANCERS);
const freelancers = data?.getFreelancersWhoAppliedToMyMissions || [];

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
            <Form.Group className="mb-3" controlId="freelancerId">
              <Form.Label>Select Candidate</Form.Label>
              <Form.Select
                value={freelancerId}
                onChange={(e) => setFreelancerId(e.target.value)}
                required
              >
                <option value="">-- Select a candidate --</option>
                {freelancers.map((f: any) => (
                  <option key={f.id} value={f.id}>
                    {f.user.username}
                  </option>
                ))}
              </Form.Select>
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