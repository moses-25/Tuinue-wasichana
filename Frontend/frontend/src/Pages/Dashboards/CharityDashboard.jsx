import { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('charities');
  const [donations, setDonations] = useState([]);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDonations([
        { id: 1, donor: 'John Smith', amount: 100, date: '2023-06-15', status: 'completed', charityId: 1 },
        { id: 2, donor: 'Sarah Johnson', amount: 50, date: '2023-06-10', status: 'completed', charityId: 1 },
        { id: 3, donor: 'Anonymous', amount: 75, date: '2023-06-05', status: 'pending', charityId: 2 }
      ]);
      
      setCharities([
        { 
          id: 1, 
          name: 'Education Fund', 
          category: 'Education', 
          goalAmount: 5000, 
          raisedAmount: 1200,
          location: 'New York, USA',
          description: 'Providing scholarships to underprivileged students',
          imageUrl: '/images/education-fund.jpg'
        },
        { 
          id: 2, 
          name: 'Medical Aid', 
          category: 'Health', 
          goalAmount: 10000, 
          raisedAmount: 3500,
          location: 'Global',
          description: 'Medical supplies for disaster areas',
          imageUrl: '/images/medical-aid.jpg'
        }
      ]);
      
      setLoading(false);
    };
    
    fetchData();
  }, []);

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
      trend: 'neutral',
      change: '+2'
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
      setCharities(charities.map(c => 
        c.id === editingCharity.id ? { ...charityData, id: editingCharity.id } : c
      ));
    } else {
      const newCharity = {
        id: Math.max(...charities.map(c => c.id)) + 1,
        ...charityData,
        raisedAmount: 0,
        imageUrl: '/images/default-charity.jpg'
      };
      setCharities([...charities, newCharity]);
    }
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="cd-loading">
        <div className="cd-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="cd-container">
      <div className="cd-header">
        <h1 className="cd-title">Charity Dashboard</h1>
        <p className="cd-subtitle">Manage your charitable campaigns and donations</p>
      </div>

      <CharityStats stats={stats} />
      
      <CharityTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
            onAddCharity={() => setIsModalOpen(true)}
            onEditCharity={(charity) => {
              setEditingCharity(charity);
              setIsModalOpen(true);
            }}
            onDeleteCharity={(id) => {
              setCharities(charities.filter(c => c.id !== id));
            }}
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
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCharity}
        charity={editingCharity}
      />
    </div>
    <Footer />
    </>
  );
};

export default CharityDashboard;