const ProgressBar = ({ current, goal }) => {
  const percentage = Math.min(100, (current / goal) * 100);
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-stats">
        <span>${current} raised</span>
        <span>Goal: ${goal}</span>
      </div>
    </div>
  );
};

export default ProgressBar;