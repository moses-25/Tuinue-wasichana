const StatsGrid = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
          <div className="stat-header">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <span className="stat-change" style={{ color: stat.change.includes('+') ? '#38a169' : '#e53e3e' }}>
              {stat.change}
            </span>
          </div>
          <h3 className="stat-title">{stat.title}</h3>
          <p className="stat-value">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;