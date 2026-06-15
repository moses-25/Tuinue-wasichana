


import { FiX, FiSave, FiLock, FiMail, FiBell } from 'react-icons/fi';

const AdminSettings = ({ onClose }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    approvalAlerts: true,
    securityLevel: 'high',
    theme: 'light'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h2>Admin Settings</h2>
        <button onClick={onClose} className="close-button">
          <FiX />
        </button>
      </div>
      
      <div className="settings-sections">
        <section className="settings-section">
          <h3><FiMail className="icon" /> Email Notifications</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              Receive email notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                name="approvalAlerts"
                checked={settings.approvalAlerts}
                onChange={handleChange}
              />
              Charity approval alerts
            </label>
          </div>
        </section>
        
        <section className="settings-section">
          <h3><FiLock className="icon" /> Security</h3>
          <div className="setting-item">
            <label>Security Level</label>
            <select 
              name="securityLevel" 
              value={settings.securityLevel}
              onChange={handleChange}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </section>
        
        <section className="settings-section">
          <h3><FiBell className="icon" /> System Preferences</h3>
          <div className="setting-item">
            <label>Theme</label>
            <select 
              name="theme" 
              value={settings.theme}
              onChange={handleChange}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </section>
      </div>
      
      <div className="settings-footer">
        <button className="save-button">
          <FiSave className="icon" /> Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;