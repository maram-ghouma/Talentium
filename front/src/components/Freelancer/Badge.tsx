import { useEffect, useState } from "react";
import { getBadgesByUserId ,Badge,BadgeType} from "../../services/reviewService";
import '../../Styles/Freelancer/badge.css';


const BadgeDisplay = ({ userid }) => {
 const badgeConfig = {
  [BadgeType.BEGINNER]: { 
    style: { backgroundColor: '#d1fae5', color: '#065f46' }, // light green bg, dark green text
    icon: '🌱', 
    label: 'Beginner' 
  },
  [BadgeType.ADVANCED]: { 
    style: { backgroundColor: '#dbeafe', color: '#1e3a8a' }, // light blue bg, dark blue text
    icon: '⭐', 
    label: 'Advanced' 
  },
  [BadgeType.CERTIFIED]: { 
    style: { backgroundColor: '#ede9fe', color: '#6b21a8' }, // light purple bg, dark purple text
    icon: '👑', 
    label: 'Certified' 
  }
};

  /*export interface Badge {
  id: number;
  type: BadgeType;
  description: string;
}*/
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  let message = "Work on missions to get a BADGE !";

  const fetchUserBadges = async () => {
      const response = await getBadgesByUserId(userid);
      if (response.length === 0) {
          message = "no badges , work harder to get one !";
          setBadges([]);
          return [];

      }
      setBadges(response);
      return message;
  };
  useEffect(() => {
    fetchUserBadges().catch(err => {
      setError("Work on missions to get a BADGE !");
    }).finally(() => setLoading(false));
  }, [userid]);

 
  
//console.log("Badges fetched:", badges);
  return (
    <div className="flex flex-wrap gap-2 mb-4" style={{ borderRadius: '8px', padding: '10px', backgroundColor: '#f9fafb' }}>
      {message && <div className="text-gray-600 text-sm mb-2">{message}</div>}
     {badges.map((badge, index) => (
        console.log("Badge:", badge),
        <div
          key={index}
          style={badgeConfig[badge.type]?.style || { backgroundColor: '#f3f4f6', color: '#374151' }} // default style
          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
            badgeConfig[badge.type]?.style || 'bg-gray-100 text-gray-800'
          }`
        }

        >
          <span className="mr-1">{badgeConfig[badge.type]?.icon}</span>
          {badgeConfig[badge.type]?.label || badge.type}
        </div>
      ))}
    </div>
  );
};
export default BadgeDisplay;