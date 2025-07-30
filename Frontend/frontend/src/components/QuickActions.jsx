import { FiUserPlus, FiCheckCircle, FiAlertTriangle, FiDownload } from 'react-icons/fi';

const QuickActions = () => {
  const actions = [
    { icon: <FiUserPlus size={20} />, title: 'Add New User', color: '#a0296a' },
    { icon: <FiCheckCircle size={20} />, title: 'Verify Charities', color: '#38a169' },
    { icon: <FiAlertTriangle size={20} />, title: 'View Reports', color: '#dd6b20' },
    { icon: <FiDownload size={20} />, title: 'Export Data', color: '#4299e1' }
  ];

  return (
    <div className="quick-actions">
      <h2 className="section-title">Quick Actions</h2>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button key={index} className="action-card" style={{ borderLeft: `4px solid ${action.color}` }}>
            <div className="action-icon" style={{ color: action.color }}>
              {action.icon}
            </div>
            <span className="action-title">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;