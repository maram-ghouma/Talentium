import React from 'react';
import { Container, Card, Button, Badge, Row, Col } from 'react-bootstrap';
import { Star, Building, Globe, MapPin, Users, Briefcase, Award, Clock } from 'lucide-react';
import '../../../Styles/client/profile.css';
interface ClientProfileProps {
  darkMode?: boolean;
}

// Mock data
const clientData = {
  name: "Sarah Anderson",
  tagline: "Trusted Client",
  avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  company: "TechVision Solutions",
  country: "United States",
  website: "www.techvision.com",
  industry: "Software Development",
  stats: {
    totalMissions: 24,
    activeMissions: 5,
    developersHired: 12,
    rating: 4.8
  },
  recentMissions: [
    {
      id: 1,
      title: "E-commerce Platform Development",
      status: "active",
      deadline: "2024-04-15"
    },
    {
      id: 2,
      title: "Mobile App UI/UX Design",
      status: "completed",
      deadline: "2024-03-01"
    }
  ],
  reviews: [
    {
      id: 1,
      developer: "John Smith",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
      rating: 5,
      comment: "Great communication and clear requirements. Would love to work again!"
    },
    {
      id: 2,
      developer: "Emma Wilson",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      rating: 4.5,
      comment: "Professional client with well-defined project scope."
    }
  ]
};

const ClientProfile: React.FC<ClientProfileProps> = ({ darkMode = false }) => {
  return (
    <Container className="py-4">
      {/* Profile Overview */}
      <Card className="mb-4" style={{
        backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
        borderColor: darkMode ? 'var(--slate)' : undefined
      }}>
        <Card.Body className="text-center">
          <img
            src={clientData.avatar}
            alt={clientData.name}
            className="rounded-circle mb-3"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
          <h5 className="mb-1">{clientData.name}</h5>
          <p className="text-muted mb-0">{clientData.tagline}</p>
        </Card.Body>
      </Card>

      {/* Public Info */}
      <Card className="mb-4" style={{
        backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
        borderColor: darkMode ? 'var(--slate)' : undefined
      }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <h5 className="mb-0">Public Information</h5>
            <Button variant="secondary" size="sm">Update</Button>
          </div>
          
          <Row>
            <Col md={6} className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <Building size={18} className="text-muted me-2" />
                <span className="text-muted">Company</span>
              </div>
              <p className="mb-0">{clientData.company}</p>
            </Col>
            <Col md={6} className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <MapPin size={18} className="text-muted me-2" />
                <span className="text-muted">Country</span>
              </div>
              <p className="mb-0">{clientData.country}</p>
            </Col>
            <Col md={6} className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <Globe size={18} className="text-muted me-2" />
                <span className="text-muted">Website</span>
              </div>
              <p className="mb-0">{clientData.website}</p>
            </Col>
            <Col md={6} className="mb-3">
              <div className="d-flex align-items-center mb-2">
                <Briefcase size={18} className="text-muted me-2" />
                <span className="text-muted">Industry</span>
              </div>
              <p className="mb-0">{clientData.industry}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Account Stats */}
      <Row className="mb-4">
        <Col sm={6} lg={3} className="mb-3">
          <Card className="h-100" style={{
            backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
            borderColor: darkMode ? 'var(--slate)' : undefined
          }}>
            <Card.Body className="text-center">
              <Briefcase size={24} className="mb-2 text-primary" />
              <h3 className="mb-1">{clientData.stats.totalMissions}</h3>
              <p className="text-muted mb-0">Total Missions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <Card className="h-100" style={{
            backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
            borderColor: darkMode ? 'var(--slate)' : undefined
          }}>
            <Card.Body className="text-center">
              <Clock size={24} className="mb-2 text-warning" />
              <h3 className="mb-1">{clientData.stats.activeMissions}</h3>
              <p className="text-muted mb-0">Active Missions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <Card className="h-100" style={{
            backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
            borderColor: darkMode ? 'var(--slate)' : undefined
          }}>
            <Card.Body className="text-center">
              <Users size={24} className="mb-2 text-success" />
              <h3 className="mb-1">{clientData.stats.developersHired}</h3>
              <p className="text-muted mb-0">Developers Hired</p>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3} className="mb-3">
          <Card className="h-100" style={{
            backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
            borderColor: darkMode ? 'var(--slate)' : undefined
          }}>
            <Card.Body className="text-center">
              <Award size={24} className="mb-2 text-info" />
              <h3 className="mb-1">{clientData.stats.rating}</h3>
              <p className="text-muted mb-0">Average Rating</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Missions */}
      <Card className="mb-4" style={{
        backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
        borderColor: darkMode ? 'var(--slate)' : undefined
      }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Recent Missions</h5>
            <Button variant="outline-primary">Post New Mission</Button>
          </div>
          
          {clientData.recentMissions.map(mission => (
            <div key={mission.id} className="border-bottom mb-3 pb-3">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">{mission.title}</h6>
                  <small className="text-muted">Deadline: {mission.deadline}</small>
                </div>
                <Badge bg={mission.status === 'active' ? 'success' : 'secondary'}>
                  {mission.status}
                </Badge>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>

      {/* Developer Reviews */}
      <Card style={{
        backgroundColor: darkMode ? 'var(--navy-secondary)' : 'white',
        borderColor: darkMode ? 'var(--slate)' : undefined
      }}>
        <Card.Body>
          <h5 className="mb-4">Developer Reviews</h5>
          
          {clientData.reviews.map(review => (
            <div key={review.id} className="mb-3 pb-3 border-bottom">
              <div className="d-flex align-items-start">
                <img
                  src={review.avatar}
                  alt={review.developer}
                  className="rounded-circle me-3"
                  style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                />
                <div>
                  <h6 className="mb-1">{review.developer}</h6>
                  <div className="mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'text-warning' : 'text-muted'}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                  <p className="mb-0 text-muted">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ClientProfile;