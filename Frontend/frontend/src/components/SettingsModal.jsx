


import { FiX, FiUsers, FiHeart, FiDollarSign } from 'react-icons/fi';

const SettingsModal = ({ onClose, stats, charities, donations }) => {
  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal">
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>
        
        <h2>Admin Settings</h2>
        
        <div className="settings-tabs">
          <button className="active">Dashboard</button>
          <button>Notifications</button>
          <button>System</button>
        </div>
        
        <div className="settings-content">
          <section>
            <h3><FiUsers /> User Statistics</h3>
            <p>Total Users: {stats[0].value}</p>
            <p>New Users (7 days): 12</p>
          </section>
          
          <section>
            <h3><FiHeart /> Charity Statistics</h3>
            <p>Total Charities: {charities.length}</p>
            <p>Pending Approvals: {charities.filter(c => c.status === 'pending').length}</p>
          </section>
          
          <section>
            <h3><FiDollarSign /> Donation Statistics</h3>
            <p>Total Donations: {stats[2].value}</p>
            <p>Pending Donations: {donations.filter(d => d.status === 'pending').length}</p>
          </section>
        </div>
        
        <div className="settings-footer">
          <button className="save-btn">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;