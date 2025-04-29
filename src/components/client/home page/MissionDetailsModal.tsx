import React, { useState } from 'react';
import { Modal, ListGroup, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { X, Star, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import '../../../Styles/client/MissionDetails.css';

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

interface MissionDetailsModalProps {
  show: boolean;
  onHide: () => void;
  mission: {
    title: string;
    description: string;
    requiredSkills: string[];
    deadline: Date;
    budget: string;
    status: 'not_assigned' | 'assigned' | 'completed';
    createdAt: Date;
  };
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
  show,
  onHide,
  mission,
  darkMode = false,
}) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'not_assigned':
        return 'warning';
      case 'assigned':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
      <>
        {show && <div className="backdrop-overlay" onClick={onHide}></div>}
        <Modal
          show={show}
          onHide={onHide}
          size="lg"
          centered
          lassName={darkMode ? 'dark-mode' : ''}
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
                      {mission.requiredSkills.join(', ')}
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
                  
                    <Badge bg={getStatusBadgeVariant(mission.status)} style={{paddingBottom:"17px"}}>
                      {mission.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Deadline</h6>
                    <p className="mb-0">{mission.deadline.toLocaleDateString()}</p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Budget</h6>
                    <p className="mb-0">{mission.budget}</p>
                  </div>
                  
                  <div>
                    <h6 className="text-muted mb-1">Created</h6>
                    <p className="mb-0">
                      {formatDistanceToNow(mission.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {mission.status === 'not_assigned' ? (
            <>
              <h5 className="mb-3">Applicants</h5>
              <ListGroup>
                {sampleApplicants.map((applicant) => (
                  <ListGroup.Item
                    key={applicant.id}
                    className="border-start-0 border-end-0 py-2"
                    style={{
                      backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
                      borderColor: darkMode ? 'var(--slate)' : undefined
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                      <div className="me-3">
                        <img
                          src={applicant.profilePictureUrl}
                          className="rounded-circle"
                          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        />
                      </div>

                        <div>
                          <h6 className="mb-0">{applicant.name}</h6>
                          <div className="d-flex align-items-center">
                            <Star size={14} className="text-warning me-1" />
                            <span className="text-muted small">{applicant.rating} / 5.0</span>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                      <a
                        href={applicant.profileUrl}
                        className="me-3 small"
                        style={{
                          color: darkMode ? 'var(--powder)' : 'var(--navy-secondary)',
                          textDecoration: 'underline',
                        }}
                      >
                        View profile
                      </a>

                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="py-1 px-2 btn-outline-primary"
                          style={{
                            borderColor: darkMode ? 'var(--powder)' : undefined,
                            color: darkMode ? 'var(--powder)' : undefined
                          }}
                        >
                          Preselect
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          ) : (
            <>
              <h5 className="mb-3">Assigned Developer</h5>
              <Card style={{ 
                backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
                border: darkMode ? '1px solid var(--slate)' : undefined
              }}>
                <Card.Body>
                  <Row>
                    <Col md={8}>
                      <div className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        <img
                          src={assignedDeveloper.profilePictureUrl}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                      </div>
                        <div>
                          <h5 className="mb-0">{assignedDeveloper.name}</h5>
                          <div className="d-flex align-items-center">
                            <Star size={16} className="text-warning me-1" />
                            <span className="text-muted">{assignedDeveloper.rating} / 5.0</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <h6 className="text-muted">Specialty</h6>
                        <p>{assignedDeveloper.specialty}</p>
                      </div>
                      <div>
                        <h6 className="text-muted">Completed Projects</h6>
                        <p>{assignedDeveloper.completedProjects}</p>
                      </div>
                    </Col>
                    <Col md={4} className="d-flex flex-column justify-content-center align-items-end">
                      <a
                        href={assignedDeveloper.profileUrl}
                        className="text-decoration-none mb-3 small"
                        style={{ color: darkMode ? 'var(--powder)' : 'var(--navy-secondary)' }}
                      >
                        View full profile
                      </a>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                      >
                        Contact Developer
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MissionDetailsModal;