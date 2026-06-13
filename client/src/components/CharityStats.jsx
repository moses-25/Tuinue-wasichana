import '../Pages/Dashboards/CharityDashboard.css';
const CharityStats = ({ stats }) => {
  return (
    <div className="cd-stats-container">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="cd-stat-card"
          style={{ borderTopColor: stat.color || '#2a7f62' }}
        >
          <div 
            className="cd-stat-icon"
            style={{ color: stat.color || '#2a7f62' }}
          >
            {stat.icon === 'dollar' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            )}
            {stat.icon === 'heart' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            )}
            {stat.icon === 'users' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            )}
            {stat.icon === 'progress' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            )}
          </div>
          <h3 className="cd-stat-title">{stat.title}</h3>
          <p className="cd-stat-value">{stat.value}</p>
          <p 
            className="cd-stat-change"
            style={{ 
              color: stat.trend === 'up' ? '#38a169' : 
                     stat.trend === 'down' ? '#e53e3e' : '#718096'
            }}
          >
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CharityStats;