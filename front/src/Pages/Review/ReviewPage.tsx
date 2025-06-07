import React from 'react';
import ReviewComponent from '../../components/review/reviewComponent';

const ReviewPage: React.FC = () => {
  const missionId = 3;

  return <ReviewComponent missionId={missionId} />;
};

export default ReviewPage;
