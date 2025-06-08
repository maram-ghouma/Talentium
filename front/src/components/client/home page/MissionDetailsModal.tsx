import React, { useEffect, useMemo, useState } from 'react';
import { Modal, ListGroup, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { X, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import '../../../Styles/client/MissionDetails.css';
import { useMutation, useQuery } from '@apollo/client';
import { REMOVE_MISSION, UPDATE_MISSION } from '../../../graphql/mission';
import { useNavigate } from 'react-router-dom';
import { ApplicationStatus, Mission } from '../../../types';
import { GET_APPLICATIONS_BY_MISSION, UPDATE_APPLICATION_STATUS } from '../../../graphql/application';
import { getFreelancerStats } from '../../../services/userService';

interface Applicant {
  id: string;
  name: string;
  profileUrl: string;
  imageUrl:string;
  status:ApplicationStatus;
  applicationId:string;
  message:string;
  resumePath:string;
  userId?:string;
}

interface FreelancerStats{
  averageRating:number;
  totalMissions: number;
  missiosnInProgress:number;
  completedMissions:number;
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
  onModifyClick?:()=>void;
}


const MissionDetailsModal: React.FC<MissionDetailsModalProps> = ({
  onMissionModified,
  onModifyClick,
  show,
  onHide,
  mission,
  darkMode = false,
}) => {
  const assignedDeveloper=mission.selectedFreelancer;
const [stats, setStats] = useState<FreelancerStats | null>(null);

useEffect(() => {
  const fetchStats = async () => {
    if (!assignedDeveloper?.user?.id) return;

    try {
      const data = await getFreelancerStats(assignedDeveloper.user.id);
      setStats(data);
    } catch (err) {
      throw new Error('Failed to load stats');
    } 
  };
  
  fetchStats();
}, [assignedDeveloper]);

  const navigate = useNavigate();
  const [openModifyAfterClose, setOpenModifyAfterClose] = useState(false);
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

  const handleMissionModified = () => {
    setIsModalOpen(false);
    if (onMissionModified) {
      onMissionModified();
    }
  };
  const [removeMission] = useMutation(REMOVE_MISSION);

const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [showApplicationInfo, setShowApplicationInfo] = useState(false);
const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
const [localStatus, setLocalStatus] = useState(mission.status);




const handleDelete = () => {
  removeMission({
    variables: { id: mission.id },
    refetchQueries: ['GetMissions'],
    onCompleted: () => {
      setShowDeleteConfirm(false); 
      onHide(); 
      console.log('here');
      navigate('/client');
    },
    onError: (error) => console.error('Error deleting mission:', error)
  });
};
const { loading, error, data } = useQuery(GET_APPLICATIONS_BY_MISSION, {
  variables: { missionId: mission.id.toString() },
});

const applications = data?.applicationsByMission || [];

const applicants: Applicant[] = useMemo(() => {
  return (data?.applicationsByMission || [])
    .filter(app => app.status !== 'REJECTED')
    .map(app => ({
      id: app.freelancer.id,
      name: app.freelancer.user.username,
      imageUrl: app.freelancer.user.imageUrl || '#',
      profileUrl: `#`,
      status: app.status,
      applicationId: app.id,
      message: app.message,
      resumePath: app.resumePath,
      userId: app.freelancer.user.id,
    }));
}, [data]);

const [statsMap, setStatsMap] = useState<Record<string, FreelancerStats>>({});

useEffect(() => {
  const fetchAllStats = async () => {
    const result: Record<string, FreelancerStats> = {};

    await Promise.all(
      applicants.map(async (app) => {
        const id = app.userId?.toString();
        if (!id) return;

        try {
          const stats = await getFreelancerStats(app.userId);
          result[id] = stats;
        } catch (err) {
          console.error(`Failed to load stats for user ${id}`, err);
        }
      })
    );

    setStatsMap(result);
  };

  if (applicants.length > 0) {
    fetchAllStats();
  }
}, [applicants]);



  const [updateStatus] = useMutation(UPDATE_APPLICATION_STATUS);

const handlePreselect = async (applicationId) => {
  try {
    await updateStatus({
      variables: { applicationId, newStatus: 'PRE_SELECTED' },
      refetchQueries: ['GetApplicationsByMission']
    });
    
    if (selectedApplicant && selectedApplicant.applicationId === applicationId) {
      setSelectedApplicant({
        ...selectedApplicant,
        status: ApplicationStatus.PRE_SELECTED
      });
    }
  } catch (error) {
    console.error('Error preselecting applicant:', error);
  }
};

  const handleSelect = (applicationId) => {
    updateStatus({
      variables: { applicationId, newStatus: 'ACCEPTED' },
      refetchQueries:['GetApplicationsByMission','GetMissions']
    }).catch(console.error);
    setShowApplicationInfo(false);
  };

const handleOpenResume = async () => {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`http://localhost:3000/files/resume/${selectedApplicant?.applicationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch resume');
    return;
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
};
const [updateMission] = useMutation(UPDATE_MISSION);

const handleMarkCompleted = async (missionId: string) => {
  try {
    await updateMission({
      variables: {
        updateMissionInput: {
          id: missionId,
          status: 'completed'
        }
      }
    });
    setLocalStatus('completed');
  } catch (error) {
    console.error("Error updating mission status:", error);
  }
};

  const handlePay = (id: string) => {
    navigate('/payment');
  };

  return (
      <>
      {showDeleteConfirm && (
        <div className="confirm-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="confirm-box" style={{ backgroundColor: !darkMode? 'var(--white)':'var(--navy-secondary)' }}>
            <p>are you sure you want to delete this?</p>
            <div className="confirm-buttons">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                style={{ backgroundColor: 'var(--slate)' }}
              >
                No
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete(); 
                }}
                style={{ backgroundColor: 'var(--rose)' }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {showApplicationInfo && (
        <div className="confirm-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="confirm-box" style={{ backgroundColor: !darkMode? 'var(--white)':'var(--navy-secondary)' }}>
                  <div
                    style={{
                      border: '1px solid var(--slate)',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      marginBottom: '1rem',
                      backgroundColor: darkMode ? 'var(--navy)' : 'var(--light-gray)',
                    }}
                  >
                    <strong>Message:</strong>
                    <p style={{ marginTop: '0.5rem' }}>{selectedApplicant?.message || 'No message provided.'}</p>
                  </div>
        {selectedApplicant?.resumePath && (
            <div
              style={{
                border: '1px solid var(--slate)',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                marginBottom: '1rem',
                backgroundColor: darkMode ? 'var(--navy)' : 'var(--light-gray)',
              }}
            >
              <strong>Resume:</strong>
              <p style={{ marginTop: '0.5rem' }}>
                <a
                  onClick={handleOpenResume}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--powder)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  View Resume
                </a>
              </p>
            </div>
          )}
            <div className="confirm-buttons">
              <button 
                onClick={() => setShowApplicationInfo(false)}
                style={{ backgroundColor: 'var(--slate)' }}
              >
                close
              </button>
              <button 
                style={{ backgroundColor: 'var(--rose)' }}
              onClick={() => selectedApplicant?.status.toLowerCase() === 'pending' ? handlePreselect(selectedApplicant?.applicationId) : handleSelect(selectedApplicant?.applicationId)}
              >
              {selectedApplicant?.status.toLowerCase() === 'pending' ? 'Preselect' : 'Select'}
              </button>
            </div>
          </div>
        </div>
      )}
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

          {mission.status === 'not_assigned' ? (
            <>
              <h5 className="mb-3">Applicants</h5>
              <ListGroup>
                {applicants.map((applicant) => (
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
                          src={applicant.imageUrl}
                          className="rounded-circle"
                          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        />
                      </div>

                        <div>
                          <h6 className="mb-0">{applicant.name}</h6>
                          <div className="d-flex align-items-center">
                            <Star size={14} className="text-warning me-1" />
                            <span className="text-muted small">
                              {statsMap[(applicant.userId||'0')]?.averageRating != null
                                ? `${statsMap[(applicant.userId||'0')].averageRating} / 5.0`
                                : "No rating yet"}
                            </span>

                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/freelancer/profile/${applicant.userId}`);
                        }}
                        className="me-3 small"
                        style={{
                          color: darkMode ? 'var(--powder)' : 'var(--navy-secondary)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
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
                            onClick={() => {
                              setSelectedApplicant(applicant); 
                              setShowApplicationInfo(true);    
                            }}
                        >
                          View Details

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
                          src={assignedDeveloper?.user.imageUrl}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                      </div>
                        <div>
                          <h5 className="mb-0">{assignedDeveloper?.user.username}</h5>
                          <div className="d-flex align-items-center">
                            <Star size={16} className="text-warning me-1" />
                            <span className="text-muted">{stats?.averageRating} / 5.0</span>{/*  baddel lehne!!!!!!!!!!!!!!!!!!!!!!!!!!!!!(w fi lokhra) */}
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <h6 className="text-muted">Specialty</h6>
                        <p>{assignedDeveloper?.skills}</p>
                      </div>
                      <div>
                        <h6 className="text-muted">Completed Projects</h6>
                        <p><p>{assignedDeveloper?.selectedMissions?.length ?? 0}</p></p>
                      </div>
                    </Col>
                    <Col md={4} className="d-flex flex-column justify-content-center align-items-end">
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/freelancer/profile/${assignedDeveloper?.user.id}`);
                        }}    
                        className="me-3 small"
                        style={{
                          color: darkMode ? 'var(--powder)' : 'var(--navy-secondary)',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
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
        <Modal.Footer className="border-top-0 d-flex justify-content-end" style={{ backgroundColor: darkMode ? 'var(--navy-secondary)' : '' }}>
          {localStatus === "not_assigned"  && (
  <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
    Delete
  </Button>
)}

{localStatus === "in_progress" && (
  <Button variant="warning" onClick={() => handleMarkCompleted(mission.id)}>
    Complete
  </Button>
)}

{localStatus === "completed" && (
  <Button variant="success" onClick={() => handlePay(mission.id)}>
    Pay
  </Button>
)}

          <Button 
              onClick={() => {
    if (onModifyClick) {
      onModifyClick(); 
    } else {
      setIsModalOpen(true);
    }
  }}
            style={{ 
              backgroundColor: darkMode ? 'var(--slate)' : 'var(--navy-primary)',
              borderColor: darkMode ? 'var(--slate)' : 'var(--navy-primary)'
            }}
          >
            Modify
          </Button>
        </Modal.Footer>
      </Modal>
      
    </>
  );
};

export default MissionDetailsModal;