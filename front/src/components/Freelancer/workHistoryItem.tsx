

import React from "react"
import { Star, ChevronDown, ChevronUp } from "lucide-react"
import "../../Styles/Freelancer/workhistory.css" 

export type WorkHistoryItem = {
  id: string
  title: string
  client: string
  date: string
  description: string
  skills: string[]
  feedback?: string
  rating?: number
}

interface WorkHistoryItemProps {
  historyItem: WorkHistoryItem
}

const WorkHistoryItem: React.FC<WorkHistoryItemProps> = ({ historyItem }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="history-item">
      <div className="history-header">
        <div>
          <h4 className="history-title">{historyItem.title}</h4>
          <p className="history-meta">
            {historyItem.client} • {historyItem.date}
          </p>
        </div>

        {historyItem.rating && (
          <div className="rating-stars">
            <div className="stars-container">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < Math.floor(historyItem.rating || 0) ? "star filled" : "star empty"}
                />
              ))}
            </div>
            <span className="rating-value">{historyItem.rating}</span>
          </div>
        )}
      </div>

      <div className={`history-description ${!isExpanded ? "description-truncated" : ""}`}>
        <p>{historyItem.description}</p>
      </div>

      <div className="skills-list">
        {historyItem.skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>

      {historyItem.feedback && (
        <div className={`feedback-section ${!isExpanded ? "hidden-section" : ""}`}>
          <h5 className="feedback-title">Client Feedback:</h5>
          <p className="feedback-text">"{historyItem.feedback}"</p>
        </div>
      )}

      <button className="toggle-button" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? (
          <>
            <ChevronUp size={16} className="toggle-icon" />
            Show less
          </>
        ) : (
          <>
            <ChevronDown size={16} className="toggle-icon" />
            Show more
          </>
        )}
      </button>
    </div>
  )
}

export default WorkHistoryItem
