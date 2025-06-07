const BadgeDisplay = ({ user }) => {
  const badgeConfig = {
    BEGINNER: { color: 'bg-green-100 text-green-800', icon: '🌱', label: 'Débutant' },
    ADVANCED: { color: 'bg-blue-100 text-blue-800', icon: '⭐', label: 'Avancé' },
    CERTIFIED: { color: 'bg-purple-100 text-purple-800', icon: '👑', label: 'Certifié' }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {user.badges?.map((badge, index) => (
        <div
          key={index}
          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
            badgeConfig[badge.type]?.color || 'bg-gray-100 text-gray-800'
          }`}
        >
          <span className="mr-1">{badgeConfig[badge.type]?.icon}</span>
          {badgeConfig[badge.type]?.label || badge.type}
        </div>
      ))}
    </div>
  );
};
export default BadgeDisplay;