

import { FiClock, FiCheck, FiAlertCircle, FiDollarSign } from 'react-icons/fi';

const RecentActivities = ({ activities }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FiCheck className="icon completed" />;
      case 'pending':
        return <FiClock className="icon pending" />;
      case 'approved':
        return <FiCheck className="icon approved" />;
      default:
        return <FiAlertCircle className="icon" />;
    }
  };

  return (
    <div className="recent-activities">
      <h2 className="section-title">Recent Activities</h2>
      <div className="activities-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              {activity.amount ? <FiDollarSign className="icon" /> : getStatusIcon(activity.status)}
            </div>
            <div className="activity-details">
              <p className="activity-action">{activity.action}</p>
              <p className="activity-user">{activity.user}</p>
            </div>
            <div className="activity-time">
              <span>{activity.time}</span>
              {activity.amount && <span className="activity-amount">{activity.amount}</span>}
            </div>
          </div>
        ))}
      </div>
      <button className="view-all-button">View All Activities</button>
    </div>
  );
};

export default RecentActivities;