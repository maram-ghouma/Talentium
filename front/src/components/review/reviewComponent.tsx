import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import './reviewComponent.css';
import { createReview, getReviewMissionById, reviewMission } from "../../services/reviewService";
import { getUser } from "../../services/userService";

interface ReviewComponentProps {
  missionId: number;
}

const ReviewComponent: React.FC<ReviewComponentProps> = ({ missionId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedMission, setSelectedMission] = useState<reviewMission | null>(null);
  const [user,setUSer] = useState<any>(null);


  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUSer(userData);
    };

    fetchUser();
  }, []);
  useEffect(() => {
    const fetchMission = async () => {
      const mission = await getReviewMissionById(missionId);
      setSelectedMission(mission);
    };

    fetchMission();
  }, [missionId]);

const handleSubmitReview = async () => {
    try {
      if (!selectedMission || !selectedMission.selectedFreelancer || typeof selectedMission.selectedFreelancer.id !== 'number') {
        return;
      }
      if(user.currentRole=='client'){
        console.log("user role is client");
      const reviewData = {
        stars: rating,
        comment,
        missionId,
        type:user.currentRole,
        reviewedUserId: selectedMission.selectedFreelancer.id,
        reviewerId: selectedMission.client.id, 
      };
          await createReview(reviewData);
          window.location.href = '/client'; 

}
      else if(user.currentRole=='freelancer'){
        console.log("user role is freelancer");

      const reviewData = {
        stars: rating,
        comment,
        missionId,
        type:user.currentRole,
        reviewedUserId: selectedMission.client.id,
        reviewerId: selectedMission.selectedFreelancer.id, 
      };
            await createReview(reviewData);
            window.location.href = '/Freelancer'; 


      }

      //window.location.href = '/client'; 

    } catch (error: any) {
      if (error.message.includes('mission')) {
        alert('Vous avez déjà laissé un avis pour cette mission.');
      }
    }
  };

  return (
    <div className="review-container">
      <h2 className="review-title">Laisser un Avis</h2>

      <div className="rating-section">
        <label className="rating-label">Note (sur 5 étoiles)</label>
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="star-button"
            >
              <Star className={`star-icon ${star <= (hoveredStar || rating) ? 'filled' : 'empty'}`} />
            </button>
          ))}
        </div>
        <p className="rating-text">
          {rating > 0 && `${rating} étoile${rating > 1 ? 's' : ''} sélectionnée${rating > 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="comment-section">
        <label className="comment-label">Commentaire (optionnel)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="comment-textarea"
          rows={4}
          placeholder="Partagez votre expérience avec ce freelancer..."
        />
      </div>

      <button
        onClick={handleSubmitReview}
        disabled={rating === 0}
        className="submit-button"
      >
        Publier l'Avis
      </button>
    </div>
  );
};

export default ReviewComponent;
