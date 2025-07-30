import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FiUsers, FiHeart, FiDollarSign, FiShield, FiSettings, 
  FiCheck, FiX, FiTrash2 
} from 'react-icons/fi';
import StatsGrid from '../../components/StatsGrid';
import RecentActivities from '../../components/RecentActivities';
import QuickActions from '../../components/QuickActions';
import UsersTable from '../../components/UsersTable';
import CharitiesTable from '../../components/CharitiesTable';
import SettingsModal from '../../components/SettingsModal';
import DonationsTable from '../../components/DonationsTable'; // 💡 New component
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [charities, setCharities] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const mockCharities = [
      { id: 1, name: 'Save the Children', email: 'info@savethechildren.org', status: 'pending', createdAt: '2023-05-01' },
      { id: 2, name: 'Local Food Bank', email: 'contact@foodbank.org', status: 'approved', createdAt: '2023-04-28' },
      { id: 3, name: 'Animal Rescue', email: 'help@animalrescue.org', status: 'pending', createdAt: '2023-05-05' },
      { id: 4, name: 'Medical Aid', email: 'support@medicalaid.org', status: 'rejected', createdAt: '2023-04-20' }
    ];

    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'donor', joined: '2023-04-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'donor', joined: '2023-04-20' },
      { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', joined: '2023-01-10' }
    ];

    const mockDonations = [
      { id: 1, donor: 'John Doe', charity: 'Local Food Bank', amount: 100, date: '2023-05-15', status: 'completed' },
      { id: 2, donor: 'Jane Smith', charity: 'Save the Children', amount: 50, date: '2023-05-14', status: 'pending' }
    ];

    setCharities(mockCharities);
    setUsers(mockUsers);
    setDonations(mockDonations);
  }, []);

  const approveCharity = (charityId) => {
    setCharities(charities.map(charity => 
      charity.id === charityId ? { ...charity, status: 'approved' } : charity
    ));
  };

  const rejectCharity = (charityId) => {
    setCharities(charities.map(charity => 
      charity.id === charityId ? { ...charity, status: 'rejected' } : charity
    ));
  };

  const deleteCharity = (charityId) => {
    setCharities(charities.filter(charity => charity.id !== charityId));
  };

  const deleteDonation = (donationId) => {
    setDonations(donations.filter(d => d.id !== donationId));
  };

  const stats = [
    { title: 'Total Users', value: users.length, icon: <FiUsers size={24} />, color: '#a0296a', change: '+12%' },
    { 
      title: 'Pending Charities', 
      value: charities.filter(c => c.status === 'pending').length, 
      icon: <FiHeart size={24} />, 
      color: '#df017b', 
      change: '+5%' 
    },
    { 
      title: 'Total Donations', 
      value: `$${donations.reduce((sum, d) => sum + d.amount, 0)}`, 
      icon: <FiDollarSign size={24} />, 
      color: '#4299e1', 
      change: '+24%' 
    },
    { 
      title: 'Admin Actions', 
      value: '28', 
      icon: <FiShield size={24} />, 
      color: '#38a169', 
      change: '+3%' 
    }
  ];

  const activities = [
    ...charities.filter(c => c.status === 'pending').map(c => ({
      id: c.id,
      action: 'New charity registration',
      user: c.name,
      time: new Date(c.createdAt).toLocaleDateString(),
      status: c.status
    })),
    ...donations.filter(d => d.status === 'pending').map(d => ({
      id: d.id,
      action: 'Donation pending',
      user: d.donor,
      time: new Date(d.date).toLocaleDateString(),
      status: d.status,
      amount: `$${d.amount}`
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

  return (
    <>
      <Navbar />

      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <div className="header-actions">
            <button 
              className="action-button"
              onClick={() => setShowSettings(true)}
            >
              <FiSettings className="icon" /> Settings
            </button>
          </div>
        </div>

        <StatsGrid stats={stats} />

        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab-button ${activeTab === 'charities' ? 'active' : ''}`}
            onClick={() => setActiveTab('charities')}
          >
            Charities
          </button>
          <button 
            className={`tab-button ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            Donations
          </button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="content-row">
              <RecentActivities activities={activities} />
              <QuickActions 
                actions={[
                  { icon: <FiCheck />, label: 'Approve Charities', onClick: () => setActiveTab('charities') },
                  { icon: <FiUsers />, label: 'View New Users', onClick: () => setActiveTab('users') },
                  { icon: <FiDollarSign />, label: 'Process Donations', onClick: () => setActiveTab('donations') }
                ]}
              />
            </div>
          )}

          {activeTab === 'users' && (
            <div className="full-width-section">
              <UsersTable 
                users={users} 
                onDelete={(userId) => setUsers(users.filter(u => u.id !== userId))}
              />
            </div>
          )}

          {activeTab === 'charities' && (
            <div className="full-width-section">
              <CharitiesTable 
                charities={charities}
                onApprove={approveCharity}
                onReject={rejectCharity}
                onDelete={deleteCharity}
              />
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="full-width-section">
              <DonationsTable 
                donations={donations}
                onDelete={deleteDonation}
              />
            </div>
          )}
        </div>

        {showSettings && (
          <SettingsModal 
            onClose={() => setShowSettings(false)}
            stats={stats}
            users={users}
            charities={charities}
            donations={donations}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
