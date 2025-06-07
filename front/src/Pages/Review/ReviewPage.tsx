import { useParams } from 'react-router-dom';
import ReviewComponent from '../../components/review/reviewComponent';

 const ReviewPage: React.FC = () => {
  const { missionId } = useParams();
  
  return <ReviewComponent missionId={Number(missionId)} />;
};
export default ReviewPage;