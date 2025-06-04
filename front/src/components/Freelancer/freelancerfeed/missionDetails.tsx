import React, { useState } from 'react';
import { Modal, ListGroup, Card, Button, Badge, Row, Col, Form } from 'react-bootstrap';
import { X, Star, User, Upload } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import '../../../Styles/client/MissionDetails.css';
import { useMutation } from '@apollo/client';
import { CREATE_APPLICATION } from '../../../graphql/application';
import { useNavigate } from 'react-router-dom';
import { Mission } from '../../../types';

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
  show,
  onHide,
  mission,
  darkMode = false,
}) => {
  const navigate = useNavigate();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [applicationMessage, setApplicationMessage] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitError, setSubmitError] = useState<string | null>(null);
const [createApplication] = useMutation(CREATE_APPLICATION, {
  context: { hasUpload: true }
});


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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };




  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

const handleSubmitApplication = async () => {
  if (!selectedFile || !applicationMessage.trim()) {
    alert('Please upload your resume and write a message');
    return;
  }

  setIsSubmitting(true);
  setSubmitError(null);

  try {
const { data } = await createApplication({
  variables: {
    createApplicationInput: {
      message: applicationMessage.trim(),
      missionId: mission.id.toString(),
    },
  },
});

const applicationId = data?.createApplication?.id;
const token = localStorage.getItem('authToken'); 

const formData = new FormData();
formData.append('file', selectedFile);

fetch(`http://localhost:3000/files/upload/resume/${applicationId}`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`, // <-- add this header!
  },
  body: formData,
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

    setSelectedFile(null);
    setApplicationMessage('');
    setShowApplyForm(false);
    onHide();
    alert('Application submitted successfully!');

  } catch (error: any) {
    setSubmitError(error.message || 'Failed to submit application');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleEasyApply = () => {
    setShowApplyForm(true);
  };

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
                  
                    <Badge bg={getStatusBadgeVariant(mission.status)} style={{paddingBottom:"17px"}}>
                      {mission.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  
                  
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

              {!showApplyForm ? (
                <div className="text-center my-5">
                  <Button
                    size="lg"
                    onClick={handleEasyApply}
                    style={{
                    backgroundColor: 'var(  --rose-darker)',
                    borderColor: 'var(  --rose-darker)',
                      padding: '12px 40px',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    Easy Apply
                  </Button>
                </div>
              ) : (
                <>
                  <h5 className="mb-3">Apply for this Mission</h5>
                  <Card style={{ 
                    backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
                    border: darkMode ? '1px solid var(--slate)' : undefined
                  }}>
                    <Card.Body>
                      <Form>
                        <Form.Group className="mb-4">
                          <Form.Label>Upload Resume (PDF only)</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Control
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChange}
                              className="me-3"
                              style={{
                                backgroundColor: darkMode ? 'var(--navy-primary)' : 'white',
                                borderColor: darkMode ? 'var(--slate)' : undefined,
                                color: darkMode ? 'white' : undefined
                              }}
                            />
                            {selectedFile && (
                              <Badge bg="success" className="ms-2">
                                {selectedFile.name}
                              </Badge>
                            )}
                          </div>
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label>Cover Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Write a brief message about why you're interested in this mission..."
                            value={applicationMessage}
                            onChange={(e) => setApplicationMessage(e.target.value)}
                            style={{
                              backgroundColor: darkMode ? 'var(--navy-primary)' : 'white',
                              borderColor: darkMode ? 'var(--slate)' : undefined,
                              color: darkMode ? 'white' : undefined
                            }}
                          />
                        </Form.Group>
                      </Form>
                    </Card.Body>
                  </Card>
                </>
              )}
          
        </Modal.Body>
        
        <Modal.Footer className="border-top-0 d-flex justify-content-end" style={{ backgroundColor: darkMode ? 'var(--navy-secondary)' : '' }}>
          {showApplyForm ? (
            <Button 
              onClick={handleSubmitApplication}
              disabled={!selectedFile || !applicationMessage.trim() || isSubmitting}
              style={{ 
                backgroundColor: 'var(--rose-darker)',
                borderColor: 'var(--rose-darker)',
                padding: '8px 24px'
              }}
              
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          ) : (
            <>

              
            </>
          )}
        </Modal.Footer>
      </Modal>
      
    </>
  );
};

export default MissionDetailsModal;