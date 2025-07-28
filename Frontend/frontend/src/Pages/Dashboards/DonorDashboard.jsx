import { useState, useEffect } from 'react';
import { 
  FiPieChart, FiDollarSign, FiHeart, FiUsers, 
  FiCalendar, FiCreditCard, FiBarChart2, FiAward
} from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState([]);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API calls in a real app
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockDonations = [
          { id: 1, charity: 'Education Fund', amount: 100, date: '2023-06-15', status: 'completed' },
          { id: 2, charity: 'Medical Aid', amount: 50, date: '2023-06-10', status: 'completed' },
          { id: 3, charity: 'Animal Rescue', amount: 75, date: '2023-06-05', status: 'pending' }
        ];

        const mockCharities = [
          { id: 1, name: 'Education Fund', category: 'Education', donated: 100 },
          { id: 2, name: 'Medical Aid', category: 'Health', donated: 50 },
          { id: 3, name: 'Animal Rescue', category: 'Animals', donated: 75 },
          { id: 4, name: 'Clean Water', category: 'Environment', donated: 0 }
        ];

        setDonations(mockDonations);
        setCharities(mockCharities);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { 
      title: 'Total Donated', 
      value: `$${donations.reduce((sum, d) => sum + (d.status === 'completed' ? d.amount : 0), 0)}`, 
      icon: <FiDollarSign size={24} />, 
      color: '#a0296a',
      change: '+24%'
    },
    { 
      title: 'Supported Charities', 
      value: charities.filter(c => c.donated > 0).length, 
      icon: <FiHeart size={24} />, 
      color: '#df017b',
      change: '+2'
    },
    { 
      title: 'Monthly Goal', 
      value: '75%', 
      icon: <FiBarChart2 size={24} />, 
      color: '#4299e1',
      change: '+5%'
    },
    { 
      title: 'Impact Score', 
      value: '4.8/5', 
      icon: <FiAward size={24} />, 
      color: '#38a169',
      change: '+0.2'
    }
  ];

  if (loading) {
    return (
      <div className="donor-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="donor-dashboard">
      <div className="dashboard-header">
        <h1>
          Donor Dashboard
        </h1>
        <p className="welcome-message">Welcome back! Here's your giving overview.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="stat-icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <h3 className="stat-title">{stat.title}</h3>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-change" style={{ color: stat.change.startsWith('+') ? '#38a169' : '#e53e3e' }}>
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          My Donations
        </button>
        <button 
          className={`tab-button ${activeTab === 'charities' ? 'active' : ''}`}
          onClick={() => setActiveTab('charities')}
        >
          My Charities
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="recent-donations">
              <h2>
                <FiDollarSign className="section-icon" />
                Recent Donations
              </h2>
              <div className="donations-list">
                {donations.slice(0, 3).map(donation => (
                  <div key={donation.id} className="donation-card">
                    <div className="donation-info">
                      <h3>{donation.charity}</h3>
                      <p className={`donation-status ${donation.status}`}>
                        {donation.status}
                      </p>
                    </div>
                    <div className="donation-details">
                      <p className="donation-amount">${donation.amount}</p>
                      <p className="donation-date">
                        <FiCalendar className="icon" />
                        {new Date(donation.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-all-button">
                View All Donations →
              </button>
            </div>

            <div className="recommended-charities">
              <h2>
                Recommended For You
              </h2>
              <div className="charities-grid">
                {charities.filter(c => c.donated === 0).slice(0, 2).map(charity => (
                  <div key={charity.id} className="charity-card">
                    <h3>{charity.name}</h3>
                    <p className="charity-category">{charity.category}</p>
                    <button className="donate-button">
                      <FiCreditCard className="icon" />
                      Donate Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="donations-content">
            <h2>
              <FiDollarSign className="section-icon" />
              My Donation History
            </h2>
            <div className="donations-table">
              <div className="table-header">
                <span>Charity</span>
                <span>Amount</span>
                <span>Date</span>
                <span>Status</span>
              </div>
              {donations.map(donation => (
                <div key={donation.id} className="table-row">
                  <span>{donation.charity}</span>
                  <span className="amount">${donation.amount}</span>
                  <span>{new Date(donation.date).toLocaleDateString()}</span>
                  <span className={`status ${donation.status}`}>
                    {donation.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'charities' && (
          <div className="charities-content">
            <h2>
              <FiHeart className="section-icon" />
              Charities I Support
            </h2>
            <div className="charities-list">
              {charities.filter(c => c.donated > 0).map(charity => (
                <div key={charity.id} className="supported-charity">
                  <div className="charity-info">
                    <h3>{charity.name}</h3>
                    <p className="charity-category">{charity.category}</p>
                  </div>
                  <div className="donation-info">
                    <p className="total-donated">Total donated: <span>${charity.donated}</span></p>
                    <button className="donate-again-button">
                      Donate Again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default DonorDashboard;