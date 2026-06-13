import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUsers, FiHeart, FiDollarSign, FiShield, FiSettings, 
  FiCheck, FiX, FiTrash2 
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { charityAPI } from '../../services/api';
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
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [charityApplications, setCharityApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch charity applications from backend
        const applicationsResponse = await charityAPI.getCharityApplications();
        if (applicationsResponse.success) {
          // Transform backend data to match component expectations
          const transformedApplications = applicationsResponse.applications.map(app => ({
            id: app.id,
            name: app.organization_name,
            email: `user${app.user_id}@example.com`, // Backend doesn't provide email, using placeholder
            status: app.status,
            createdAt: app.submitted_at,
            mission: app.mission,
            user_id: app.user_id
          }));
          setCharityApplications(transformedApplications);
        }

        // Mock data for users and donations (you can replace with real API calls later)
        const mockUsers = [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'donor', joined: '2023-04-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'donor', joined: '2023-04-20' },
          { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', joined: '2023-01-10' }
        ];

        const mockDonations = [
          { id: 1, donor: 'John Doe', charity: 'Local Food Bank', amount: 100, date: '2023-05-15', status: 'completed' },
          { id: 2, donor: 'Jane Smith', charity: 'Save the Children', amount: 50, date: '2023-05-14', status: 'pending' }
        ];

        setUsers(mockUsers);
        setDonations(mockDonations);

      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data');
        
        // Fallback to empty arrays
        setCharityApplications([]);
        setUsers([]);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAuthenticated, user, navigate]);

  const approveCharity = async (applicationId) => {
    try {
      const result = await charityAPI.approveCharityApplication(applicationId);
      if (result.success) {
        // Update local state
        setCharityApplications(charityApplications.map(app => 
          app.id === applicationId ? { ...app, status: 'approved' } : app
        ));
        alert('Charity application approved successfully!');
      } else {
        alert('Failed to approve charity application');
      }
    } catch (error) {
      console.error('Error approving charity:', error);
      alert('Error approving charity application');
    }
  };

  const rejectCharity = async (applicationId) => {
    try {
      const result = await charityAPI.rejectCharityApplication(applicationId);
      if (result.success) {
        // Update local state
        setCharityApplications(charityApplications.map(app => 
          app.id === applicationId ? { ...app, status: 'rejected' } : app
        ));
        alert('Charity application rejected successfully!');
      } else {
        alert('Failed to reject charity application');
      }
    } catch (error) {
      console.error('Error rejecting charity:', error);
      alert('Error rejecting charity application');
    }
  };

  const deleteCharity = (applicationId) => {
    if (confirm('Are you sure you want to delete this charity application?')) {
      setCharityApplications(charityApplications.filter(app => app.id !== applicationId));
    }
  };

  const deleteDonation = (donationId) => {
    setDonations(donations.filter(d => d.id !== donationId));
  };

  const stats = [
    { title: 'Total Users', value: users.length, icon: <FiUsers size={24} />, color: '#a0296a', change: '+12%' },
    { 
      title: 'Pending Charities', 
      value: charityApplications.filter(c => c.status === 'pending').length, 
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
    ...charityApplications.filter(c => c.status === 'pending').map(c => ({
      id: c.id,
      action: 'New charity application',
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

  // Show loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="admin-dashboard loading-state">
          <div className="spinner-loader"></div>
          <p>Loading admin dashboard...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className="admin-dashboard error-state">
          <h2>Unable to Load Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Show access denied for non-admins
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <>
        <Navbar />
        <div className="admin-dashboard access-denied">
          <h2>Admin Dashboard Access</h2>
          <p>You need to be logged in as an administrator to access this dashboard.</p>
          <button onClick={() => navigate('/')} className="login-btn">
            Go to Login
          </button>
        </div>
        <Footer />
      </>
    );
  }

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
                charities={charityApplications}
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
            charities={charityApplications}
            donations={donations}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;
