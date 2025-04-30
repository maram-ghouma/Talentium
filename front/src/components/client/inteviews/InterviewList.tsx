import React from 'react';
import { Card, Badge, Form, Row, Col } from 'react-bootstrap';
import { Clock, Bell, BellOff } from 'lucide-react';
import { Interview } from '../../../types';
import { formatDateTime } from '../../../utils/DateUtil';

interface InterviewListProps {
  interviews: Interview[];
  onToggleReminder: (id: string) => void;
}

const InterviewList: React.FC<InterviewListProps> = ({ interviews, onToggleReminder }) => {
  if (interviews.length === 0) {
    return (
      <Card className="text-center p-4 mb-4">
        <Card.Body>
          <p className="mb-0">No upcoming interviews scheduled.</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="interview-list">
      {interviews.map((interview) => (
        <Card key={interview.id} className="mb-3 interview-card" style={{ transition: 'all 0.2s ease-in-out' }}>
          <Card.Body>
            <Row>
              <Col xs={12} md={6}>
                <h5 className="interviewee" >{interview.candidateName}</h5>
                <p className="mb-2 text-muted">{interview.topic}</p>
                <div className="d-flex align-items-center">
                  <Clock size={16} className="me-2" />
                  <span>{formatDateTime(interview.scheduledDateTime)}</span>
                </div>
              </Col>
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-md-end mt-3 mt-md-0">
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id={`remind-switch-${interview.id}`}
                    label=""
                    checked={interview.remindMe}
                    onChange={() => onToggleReminder(interview.id)}
                    className="me-2"
                  />
                  <label htmlFor={`remind-switch-${interview.id}`} className="mb-0">
                    {interview.remindMe ? (
                      <>
                        <Bell size={16} className="me-1" />
                        <span className="d-none d-sm-inline">Reminder On</span>
                      </>
                    ) : (
                      <>
                        <BellOff size={16} className="me-1" />
                        <span className="d-none d-sm-inline">Reminder Off</span>
                      </>
                    )}
                  </label>
                  <Badge 
                    bg="#641717"
                    className="ms-3" 
                    style={{ 
                      color: 'var(--navy-secondary)', 
                      borderColor: 'var(--slate)', 
                      borderWidth: '1.25px', 
                      borderStyle: 'solid',
                      paddingBottom:'16px' 
                    }}
                  >
                    {new Date(interview.scheduledDateTime) > new Date() ? 'Upcoming' : 'Past'}
                  </Badge>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default InterviewList;