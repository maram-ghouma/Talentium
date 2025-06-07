import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { Container, Card, Button, Badge, Row, Col, Form } from 'react-bootstrap';
import { Star, Building, Globe, MapPin, Users, Briefcase, Award, Clock, Mail, Linkedin, Phone, Edit, Save, X, Circle, DollarSign, Github } from 'lucide-react';
import '../../Styles/Freelancer/profile.css';
import { FreelancerProfileType, FreelancerStats, Mission, Review } from '../../types';
import { updateClientProfile, updateFreelancerProfile } from '../../services/userService';
import MissionDetailsModal from '../client/home page/MissionDetailsModal';
import { CreateMission } from '../client/home page/CreateMission';
import BadgeDisplay from './Badge';

interface ClientProfileProps {
  darkMode?: boolean;
  profile: FreelancerProfileType
  isEditable?: boolean; 
  missions?: Mission[]; 
  reviews?: Review[]; 
  stats?: FreelancerStats;
}


const clientData = {
  
  stats: {
    totalMissions: 24,
    activeMissions: 5,
    developersHired: 12,
  },
  
};

const ClientProfile: React.FC<ClientProfileProps> = ({ darkMode = false , profile,isEditable ,missions,reviews,stats}) => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showCreateMission, setShowCreateMission] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [formData, setFormData] = useState({
  name: '',
  tagline: '',
  hourlyRate: '',
  country: '',
  github: '',
  email: '',
  phone: '',
  linkedin: '',
  avatar: '',
  skills: [] as string[],
  stripeAccountId: '',
});

useEffect(() => {
  if (profile && profile.user) {
    setFormData({
      name: profile.user.username ?? '',
      tagline: profile.bio ?? '',
      hourlyRate: profile.hourlyRate?.toString() ?? '',
      country: profile.country ?? '',
      github: profile.github ?? '',
      email: profile.user.email ?? '',
      phone: profile.phoneNumber ?? '',
      linkedin: profile.linkedIn ?? '',
      avatar: profile.user.imageUrl ?? '',
      skills: profile.skills ?? [],
      stripeAccountId: profile.stripeAccountId ?? '',
    });
  }
}, [profile]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSkill, setNewSkill] = useState("");
  const [selectedSkillToDelete, setSelectedSkillToDelete] = useState("");
    
    const statusColors = {
      not_assigned: '#F59E0B',
      in_progress: '#3B82F6',
      completed: '#10B981',
    };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const [file, setFile] = useState<File | null>(null);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFile(file);
    console.log('Selected file:', file);
  }
};

  


const handleSavePersonal = async () => {
  try {
    const formPayload = new FormData();

    formPayload.append('username', formData.name); 
    formPayload.append('bio', formData.tagline);

    if (file) {
      formPayload.append('imageUrl', file); 
    }

    const result = await updateFreelancerProfile(formPayload);
    console.log('Personal data updated', result);
    window.location.reload(); 
    setIsEditingPersonal(false);
  } catch (error) {
    console.error('Error updating personal data:', error);
  }
};
  const handleOpenDetails = (mission: Mission) => {
      setSelectedMission(mission);
  };
  const handleCloseDetails = () => {
    setSelectedMission(null);
  };

  const handleSaveInfo = async () => {
  try {
    const updatedInfoData = {
      hourlyRate: formData.hourlyRate,
      country: formData.country,
      github: formData.github,
      email: formData.email,
      phoneNumber: formData.phone,
      linkedIn: formData.linkedin,
      stripeAccountId: formData.stripeAccountId,
    };

    const result = await updateFreelancerProfile(updatedInfoData);
    console.log('Info data updated', result);
    setIsEditingInfo(false);
  } catch (error) {
    console.error('Error updating info data:', error);
  }
}
  const handleSaveSkills = async () => {
     try {
      const formObj = new FormData();
     if (Array.isArray(formData.skills)) {
      formData.skills.forEach(skill => {
        formObj.append('skills[]', skill);
      });
    }

    const result = await updateFreelancerProfile(formObj);
    console.log('Info data updated', result);
    setIsEditingSkills(false);
  } catch (error) {
    console.error('Error updating info data:', error);
  }
  };

  return (
    <>
      <Container className="py-4">
  {/* Profile Overview */}
  <Card className="mb-4 card profile-card">
    <Card.Body>
      {isEditingPersonal ? (
        <div className="text-center">
          {isEditable && (
            <div className="d-flex justify-content-end">
              <div className="action-icon-group">
                <div className="action-icon cancel-icon" onClick={() => setIsEditingPersonal(false)}>
                  <X size={20} />
                </div>
                <div className="action-icon save-icon" onClick={handleSavePersonal}>
                  <Save size={20} />
                </div>
              </div>
            </div>
          )}

          <div className="position-relative mb-3 mx-auto" style={{ width: '80px', height: '80px' }}>
            <img
              src={formData.avatar}
              alt={formData.name}
              className="rounded-circle"
              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
            />
            {isEditable && (
              <div className="position-relative">
                {/* Edit icon button */}
                <button
                  type="button"
                  className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-1 border-0"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ backgroundColor: 'var(--navy-secondary)' }}
                >
                  <Edit size={16} color="white" />
                </button>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          <Form className="profile-form">
            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center info-label">
                <span>Profile Name</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-center"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="d-flex align-items-center info-label">
                <span>Bio</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                className="text-center"
              />
            </Form.Group>
          </Form>
        </div>
      ) : (
        <div className="text-center">
          {isEditable && (
            <div className="d-flex justify-content-end">
              <div className="edit-icon" onClick={() => setIsEditingPersonal(true)}>
                <Edit size={20} />
              </div>
            </div>
          )}
           <div className="profile-header-meta">
        <img src={formData.avatar} alt={formData.name} className="profile-avatar" />

        <div className="profile-header-info">
          <h1 className="prof-name">{formData.name}</h1>
          <h2 className="prof-title" style={{fontSize: 'var(--font-size-sm)'}}>{formData.tagline}</h2>
          <BadgeDisplay user={profile?.user.id} />

          <div className="profile-meta">
            <div className="profile-meta-item">
              <MapPin size={16} />
              <span>{formData.country}</span>
            </div>
            
            <div className="profile-meta-item">
              <Mail size={16} />
              <span>{formData.email}</span>
            </div>

            <div className="profile-meta-item">
              <Phone size={16} />
              <span>{formData.phone}</span>
            </div>
          </div>
          
          <div className="profile-social">
            {formData.linkedin && (
              <a 
                href={formData.linkedin.startsWith('http') ? formData.linkedin : `https://${formData.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="profile-social-link"
                aria-label="LinkedIn profile"
              >
                <Linkedin size={18} />
              </a>
            )}

            {formData.github && (
              <a 
                href={formData.github.startsWith('http') ? formData.github : `https://${formData.github}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="profile-social-link"
                aria-label="GitHub profile"
              >
                <Github size={18} />
              </a>
            )}
            
            
            
           
          </div>
        </div>
      </div>
        </div>
      )}
    </Card.Body>
  </Card>


        {/* Public Info */}
<Card className="mb-4 card">
  <Card.Body>
    <div className="profile-header">
      <h5 className="mb-0">Public Information</h5>
      {isEditable && (
        !isEditingInfo ? (
          <div className="edit-icon" onClick={() => setIsEditingInfo(true)}>
            <Edit size={20} />
          </div>
        ) : (
          <div className="action-icon-group">
            <div className="action-icon cancel-icon" onClick={() => setIsEditingInfo(false)}>
              <X size={20} />
            </div>
            <div className="action-icon save-icon" onClick={handleSaveInfo}>
              <Save size={20} />
            </div>
          </div>
        )
      )}
    </div>

    {isEditingInfo ? (
      <Form className="profile-form">
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center info-label">
                <DollarSign size={18} className="me-2" />
                <span>Hourly Rate</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center info-label">
                <MapPin size={18} className="me-2" />
                <span>Country</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center info-label">
                <Mail size={18} className="me-2" />
                <span>Email</span>
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center info-label">
                <Phone size={18} className="me-2" />
                <span>Phone</span>
              </Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center info-label">
                <Github size={18} className="me-2" />
                <span>GitHub</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label className="d-flex align-items-center info-label">
                <Linkedin size={18} className="me-2" />
                <span>LinkedIn</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label className="d-flex align-items-center info-label">
                          <MapPin size={18} className="me-2" />
                          <span>Stripe Account ID</span>
                        </Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter your Stripe Account ID"
                          name="stripeAccountId"
                          value={formData.stripeAccountId}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
        </Row>
      </Form>
    ) : (
      <Row>
        <Col md={6} className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <DollarSign size={18} className="text-primary me-2" />
            <span className="info-label">Hourly Rate</span>
          </div>
          <p className="info-value">{formData.hourlyRate}</p>
        </Col>
        <Col md={6} className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <MapPin size={18} className="text-danger me-2" />
            <span className="info-label">Country</span>
          </div>
          <p className="info-value">{formData.country}</p>
        </Col>
        
        <Col md={6} className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <Mail size={18} className="text-primary me-2" />
            <span className="info-label">Email</span>
          </div>
          <p className="info-value">{formData.email}</p>
        </Col>
        <Col md={6} className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <Phone size={18} className="text-success me-2" />
            <span className="info-label">Phone</span>
          </div>
          <p className="info-value">{formData.phone}</p>
        </Col>
        <Col md={6} className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <Github size={18} className="text-success me-2" />
            <span className="info-label">GitHub</span>
          </div>
          <p className="info-value">{formData.github}</p>
        </Col>
        <Col md={6} className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <Linkedin size={18} className="text-info me-2" />
            <span className="info-label">LinkedIn</span>
          </div>
          <p className="info-value">{formData.linkedin}</p>
        </Col>

      </Row>
    )}
  </Card.Body>
</Card>

<Card className="mb-4 card">
  <Card.Body>
    <div className="profile-header d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Skills</h5>
      {isEditable && (
        !isEditingSkills ? (
          <div className="edit-icon" onClick={() => setIsEditingSkills(true)}>
            <Edit size={20} />
          </div>
        ) : (
          <div className="action-icon-group d-flex gap-2">
            <div className="action-icon cancel-icon" onClick={() => setIsEditingSkills(false)}>
              <X size={20} />
            </div>
            <div className="action-icon save-icon" onClick={handleSaveSkills}>
              <Save size={20} />
            </div>
          </div>
        )
      )}
    </div>

    {isEditingSkills ? (
      <>
        <Form className="profile-form" onSubmit={(e) => {
  e.preventDefault();
  if (newSkill.trim() !== "") {
    setFormData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill.trim()],
    }));
    setNewSkill("");
  }
}}>
  <Form.Group className="mb-3">
    <Form.Label className="d-flex align-items-center info-label">
      <span>Add a skill</span>
    </Form.Label>
    <Form.Control
      type="text"
      value={newSkill}
      onChange={(e) => setNewSkill(e.target.value)}
      className="text-center"
      placeholder="e.g. JavaScript"
    />
  </Form.Group>
  <Button type="submit" variant="primary">Add</Button>

  <Form.Group className="mb-3" style={{marginTop: '20px'}}>
  <Form.Label className="d-flex align-items-center info-label">
    <span>Delete a skill</span>
  </Form.Label>
  <Form.Select
    value={selectedSkillToDelete}
    onChange={(e) => setSelectedSkillToDelete(e.target.value)}
    className="text-center"
  >
    <option value="">Select a skill to delete</option>
    {formData.skills?.map((skill, index) => (
      <option key={index} value={skill}>{skill}</option>
    ))}
  </Form.Select>
</Form.Group>

<Button
  variant="danger"
  onClick={() => {
    if (selectedSkillToDelete) {
      setFormData((prev) => ({
        ...prev,
        skills: prev.skills.filter((s) => s !== selectedSkillToDelete),
      }));
      setSelectedSkillToDelete("");
    }
  }}
>
  Delete
</Button>


</Form>

         
      </>
    ) : (
       <div className="profile-skills">
  {formData.skills && formData.skills.length > 0 ? (
    formData.skills.map((skill, index) => (
      <span key={index} className="profile-skill">{skill}</span>
    ))
  ) : (
    <span className="text-muted">No skills added</span>
  )}
</div>

    )}
  </Card.Body>
</Card>


        {/* Account Stats */}
        <Row className="mb-4">
          <Col sm={6} lg={3} className="mb-3">
            <Card className="h-100 card">
              <Card.Body className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
                  <Briefcase size={24} color="#0d6efd" />
                </div>
                <div className="stat-value">{stats?.totalMissions}</div>
                <div className="stat-label" style={{paddingTop:'10px'}}>Total Missions</div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={3} className="mb-3">
            <Card className="h-100 card">
              <Card.Body className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}>
                  <Clock size={24} color="#ffc107" />
                </div>
                <div className="stat-value">{stats?.completedMissions}</div>
                <div className="stat-label" style={{paddingTop:'10px'}}>Active Missions</div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={3} className="mb-3">
            <Card className="h-100 card">
              <Card.Body className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}>
                  <Users size={24} color="#198754" />
                </div>
                <div className="stat-value">{stats?.completedMissions}</div>
                <div className="stat-label" style={{paddingTop:'10px'}}>Completed Missions</div>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} lg={3} className="mb-3">
            <Card className="h-100 card">
              <Card.Body className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: 'rgba(13, 202, 240, 0.1)' }}>
                  <Award size={24} color="#0dcaf0" />
                </div>
                <div className="stat-value">{stats?.averageRating}</div>
                <div className="stat-label" style={{paddingTop:'10px'}}>Average Rating</div>
              </Card.Body>
            </Card>
          </Col>
          
        </Row>

        {/* Recent Missions */}
        <Card className="mb-4 card">
          <Card.Body>
            <div className="profile-header">
              <h5 className="mb-0">Recent Missions</h5>
                          { isEditable && (

              <Button variant="outline-primary" size="sm" onClick={() => setShowCreateMission(true)} >see more </Button>
                          )}
              </div>
            
            {!missions ||  missions.length === 0 ? (
                  <p className="text-muted mt-3">No previous missions.</p>
                ) : (
                  missions.map((mission) => (
                    <div
                      key={mission.id}
                      className="border-bottom mb-3 pb-3"
                      onClick={() => handleOpenDetails(mission)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{mission.title}</h6>
                          <div className="mission-status d-flex align-items-center gap-1">
                            <Circle size={12} style={{ color: statusColors[mission.status] }} />
                            <span>{mission.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Card.Body>
            </Card>

        {/* Developer Reviews */}
<Card className="card">
  <Card.Body>
    <div className="profile-header">
      <h5 className="mb-0">Client Reviews</h5>
    </div>

    {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="review-card mb-3 pb-3">
                      <div className="d-flex align-items-start">
                        <img
                          src={review.reviewer.imageUrl}
                          alt={review.reviewer.username}
                          className="rounded-circle me-3"
                          style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="mb-1">{review.reviewer.username}</h6>
                          <div className="mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < review.stars ? 'text-warning' : 'text-muted'}
                                fill={i < review.stars ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                          <p className="mb-0 text-muted">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mt-3">No reviews yet.</p>
                )}
  </Card.Body>
</Card>

        

        
      </Container>
    </>
  );
};


export default ClientProfile;