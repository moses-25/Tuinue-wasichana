import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { charityAPI } from '../../services/api';
import CharityStats from '../../components/CharityStats';
import CharityTabs from '../../components/CharityTabs';
import CharityList from '../../components/CharityList';
import DonationList from '../../components/DonationList';
import AnalyticsPanel from '../../components/AnalyticsPanel';
import CharityFormModal from '../../components/CharityFormModal';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './CharityDashboard.css';

const CharityDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('charities');
  const [donations, setDonations] = useState([]);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [newCharityAdded, setNewCharityAdded] = useState(false);
  const [error, setError] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'charity') {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch charity's donations
        const donationsResponse = await charityAPI.getMyDonations();
        if (donationsResponse && Array.isArray(donationsResponse)) {
          setDonations(donationsResponse);
        }

        // For now, we'll show a message about charity application status
        // since the backend creates charity records through the application process
        setApplicationStatus('approved'); // Assuming user is already approved charity
        
        // Mock charity data for now since the backend structure might be different
        setCharities([
          { 
            id: 1, 
            name: user.name || 'My Charity', 
            category: 'Education', 
            goalAmount: 10000, 
            raisedAmount: donationsResponse?.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0) || 0,
            location: 'Kenya',
            description: 'Empowering girls through education and support',
            imageUrl: '/images/default-charity.jpg'
          }
        ]);

      } catch (err) {
        console.error('Error fetching charity data:', err);
        setError('Failed to load charity data');
        
        // Fallback data
        setCharities([]);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  // Update stats when charities change
  const stats = [
    {
      title: 'Total Raised',
      value: `$${charities.reduce((sum, c) => sum + c.raisedAmount, 0)}`,
      icon: 'dollar',
      trend: 'up',
      change: '12%'
    },
    {
      title: 'Active Campaigns',
      value: charities.length,
      icon: 'campaign',
      trend: charities.length > 2 ? 'up' : 'neutral',
      change: charities.length > 2 ? '+2' : '0'
    },
    {
      title: 'Total Donations',
      value: donations.length,
      icon: 'donations',
      trend: 'up',
      change: '+5'
    },
{
  title: 'Completion Rate',
  value: `${Math.round(
    (charities.reduce((sum, c) => sum + c.raisedAmount, 0) / 
    Math.max(1, charities.reduce((sum, c) => sum + c.goalAmount, 0))) * 100
  )}%`,
  icon: 'progress',
  trend: 'up',
  change: '8%',
  color: '#4361ee' // Explicitly set color to blue instead of default green
}
  ];

  const handleSaveCharity = (charityData) => {
    if (editingCharity) {
      // Update existing charity
      setCharities(charities.map(c => 
        c.id === editingCharity.id ? { ...charityData, id: editingCharity.id } : c
      ));
    } else {
      // Add new charity with dynamic ID
      const newCharity = {
        id: Math.max(0, ...charities.map(c => c.id)) + 1, // Ensure minimum ID is 1
        ...charityData,
        raisedAmount: 0,
        imageUrl: charityData.imageUrl || '/images/default-charity.jpg',
        createdAt: new Date().toISOString()
      };
      
      setCharities([newCharity, ...charities]); // Add new charity at the beginning
      setNewCharityAdded(true); // Trigger UI feedback
      
      // Reset the feedback after 3 seconds
      setTimeout(() => setNewCharityAdded(false), 3000);
    }
    
    setIsModalOpen(false);
    setEditingCharity(null);
  };

  if (loading) {
    return (
      <div className="cd-loading">
        <div className="cd-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Show message for non-charity users
  if (!isAuthenticated || user?.role !== 'charity') {
    return (
      <>
        <Navbar />
        <div className="cd-container">
          <div className="cd-access-denied">
            <h2>Charity Dashboard Access</h2>
            <p>You need to be approved as a charity to access this dashboard.</p>
            <div className="cd-actions">
              <a href="/apply-charity" className="cd-apply-btn">
                Apply as a Charity
              </a>
              <a href="/home" className="cd-home-btn">
                Go to Homepage
              </a>
            </div>
          </div>
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
        <div className="cd-container">
          <div className="cd-error">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="cd-retry-btn">
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cd-container">
        <div className="cd-header">
          <h1 className="cd-title">Charity Dashboard</h1>
          <p className="cd-subtitle">Manage your charitable campaigns and donations</p>
          
          {/* Success message when new charity is added */}
          {newCharityAdded && (
            <div className="cd-success-message">
              New charity added successfully!
            </div>
          )}
        </div>

        <CharityStats stats={stats} />
        
        <CharityTabs 
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setNewCharityAdded(false); // Reset feedback when changing tabs
          }}
          tabs={[
            { id: 'charities', label: 'My Charities', icon: 'heart' },
            { id: 'donations', label: 'Donations', icon: 'dollar' },
            { id: 'analytics', label: 'Analytics', icon: 'chart' }
          ]}
        />
        
        <div className="cd-content">
          {activeTab === 'charities' && (
            <CharityList
              charities={charities}
              onAddCharity={() => {
                setEditingCharity(null);
                setIsModalOpen(true);
              }}
              onEditCharity={(charity) => {
                setEditingCharity(charity);
                setIsModalOpen(true);
              }}
              onDeleteCharity={(id) => {
                setCharities(charities.filter(c => c.id !== id));
              }}
              newCharityAdded={newCharityAdded}
            />
          )}
          
          {activeTab === 'donations' && (
            <DonationList donations={donations} charities={charities} />
          )}
          
          {activeTab === 'analytics' && (
            <AnalyticsPanel donations={donations} charities={charities} />
          )}
        </div>
        
        <CharityFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCharity(null);
          }}
          onSave={handleSaveCharity}
          charity={editingCharity}
        />
      </div>
      <Footer />
    </>
  );
};

export default CharityDashboard;