import React, { useState } from 'react';
import { Modal, ListGroup, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { X, Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import '../../../Styles/client/MissionDetails.css';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Mission } from '../../types';

interface Applicant {
  id: string;
  name: string;
  rating: number;
  profileUrl: string;
  profilePictureUrl:string;
}

interface Developer {
  id: string;
  name: string;
  rating: number;
  profileUrl: string;
  specialty: string;
  completedProjects: number;
  profilePictureUrl:string;
}
interface ModifyButtonProps {
  mission: Mission;
  onMissionModified?: () => void; 
}
interface MissionDetailsModalProps {
  show: boolean;
  onHide: () => void;
  onMissionModified?: () => void;
  mission: Mission
  darkMode?: boolean;
}

const sampleApplicants: Applicant[] = [
  { id: '1', name: 'Sarah Wilson', rating: 4.8, profileUrl: '#',profilePictureUrl:'#'},
  { id: '2', name: 'James Rodriguez', rating: 4.9, profileUrl: '#',profilePictureUrl:'#'},
  { id: '3', name: 'Emma Thompson', rating: 4.7, profileUrl: '#' ,profilePictureUrl:'#'}
];

const assignedDeveloper: Developer = {
  id: '2',
  name: 'James Rodriguez',
  rating: 4.9,
  profileUrl: '#',
  specialty: 'Frontend Development',
  completedProjects: 34,
  profilePictureUrl:'#'
};

const MissionDetailsModal: React.FC<MissionDetailsModalProps> = ({
  onMissionModified,
  show,
  onHide,
  mission,
  darkMode = false,
}) => {







  return (
      <>

        {show && <div className="backdrop-overlay" onClick={onHide}></div>}
        <Modal
          show={show}
          onHide={onHide}
          size="lg"
          centered
          className={darkMode ? 'dark-mode' : ''}
          backdropClassName={darkMode ? 'dark-backdrop' : ''}
          
        >
        <Modal.Header className="border-bottom-0" style={{ backgroundColor: darkMode ? 'var(--navy-secondary)' : ''}}>
          <Modal.Title className="w-100" style={{ color: darkMode? 'white': ''}}>
            <div className="d-flex justify-content-between align-items-center" >
              <h4 className="mb-0">{mission.title}</h4>
              <Button
                variant="link"
                onClick={onHide}
                className="p-0 text-secondary"
                style={{ color: darkMode ? 'var(--powder)' : 'inherit' }}
              >
                <X size={24} />
              </Button>
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ backgroundColor: darkMode ? 'var(--navy-primary)' : ''}}>
          <Row>
            <Col lg={7}>
              <Card className="mb-4" style={{ 
                backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
                border: darkMode ? '1px solid var(--slate)' : undefined
              }}>
                <Card.Body>
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Description</h6>
                    <p>{mission.description}</p>
                  </div>

                  <div className="mb-3">
                    <h6 className="text-muted mb-2">Required Skills</h6>
                    <div>
                    <p>
                      {mission.requiredSkills?.join(', ')}
                    </p>
                  </div>

                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={5}>
              <Card className="mb-4" style={{ 
                backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
                border: darkMode ? '1px solid var(--slate)' : undefined
              }}>
                <Card.Body>
                  
                    
                  
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Deadline</h6>
                    <p className="mb-0">{mission.deadline?.toLocaleString()}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Budget</h6>
                    <p className="mb-0">{mission.budget}</p>
                  </div>
                  
                  <div>
                    <h6 className="text-muted mb-1">Created</h6>
                    <p className="mb-0">
                      {formatDistanceToNow(mission.createdAt? mission.createdAt:'', { addSuffix: true })}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          
        </Modal.Body>
        <Modal.Footer className="border-top-0 d-flex justify-content-end" style={{ backgroundColor: darkMode ? 'var(--navy-secondary)' : '' }}>

        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MissionDetailsModal;