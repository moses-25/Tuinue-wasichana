import '../Pages/Dashboards/CharityDashboard.css';

const AnalyticsPanel = ({ donations, charities }) => {
  return (
    <div>
      <h2 className="cd-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        Campaign Analytics
      </h2>
      
      <div className="cd-analytics-grid">
        <div className="cd-analytics-card">
          <h3>Donations Over Time</h3>
          <div className="cd-placeholder-chart">
            <p>Line chart visualization would appear here</p>
          </div>
        </div>
        
        <div className="cd-analytics-card">
          <h3>Top Donors</h3>
          <div className="cd-top-donors">
            {donations.slice(0, 5).map((donation, index) => (
              <div key={index} className="cd-donor-item">
                <span>{donation.donor}</span>
                <span>${donation.amount}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="cd-analytics-card">
          <h3>Campaign Progress</h3>
          <div className="cd-campaign-progress">
            {charities.map(charity => {
              const percentage = Math.min(100, (charity.raisedAmount / charity.goalAmount) * 100);
              return (
                <div key={charity.id} className="cd-progress-item">
                  <span>{charity.name}</span>
                  <div className="cd-progress-bar">
                    <div 
                      className="cd-progress-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span>{Math.round(percentage)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;