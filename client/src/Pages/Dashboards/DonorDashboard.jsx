// DonorDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPieChart, FiDollarSign, FiHeart, FiUsers,
  FiCalendar, FiCreditCard, FiBarChart2, FiAward
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { donationAPI, charityAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState([]);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't redirect immediately - wait for auth to load
    if (isAuthenticated === false) {
      navigate('/');
      return;
    }
    
    // If user is authenticated but not a donor, show access denied instead of redirecting
    if (isAuthenticated && user && user.role !== 'donor') {
      setLoading(false);
      return;
    }
    
    // Only fetch data if user is authenticated and is a donor
    if (!isAuthenticated || !user || user.role !== 'donor') {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize variables
        let transformedDonations = [];
        
        // Fetch donation history from backend
        try {
          const donationsResponse = await donationAPI.getDonationHistory();
          if (donationsResponse && donationsResponse.success && donationsResponse.donations) {
            // Transform backend data to match component expectations
            transformedDonations = donationsResponse.donations.map(donation => ({
              id: donation.id,
              charity: donation.charity_name || `Charity ${donation.charity_id}`,
              charity_id: donation.charity_id,
              amount: parseFloat(donation.amount),
              date: donation.timestamp || donation.created_at,
              status: donation.status === 'complete' ? 'completed' : donation.status
            }));
            setDonations(transformedDonations);
          } else {
            console.log('No donations found or API returned unexpected format');
            setDonations([]);
          }
        } catch (donationError) {
          console.error('Error fetching donations:', donationError);
          setDonations([]);
        }

        // Fetch all charities to show recommendations
        try {
          const charitiesResponse = await charityAPI.getCharities();
          if (charitiesResponse && charitiesResponse.success && charitiesResponse.charities) {
            // Calculate donated amounts per charity using the transformed donations
            const charitiesWithDonations = charitiesResponse.charities.map(charity => {
              const donatedAmount = transformedDonations
                .filter(d => d.charity_id === charity.id && d.status === 'completed')
                .reduce((sum, d) => sum + parseFloat(d.amount), 0);
              
              return {
                id: charity.id,
                name: charity.name,
                category: charity.category || 'General',
                donated: donatedAmount,
                description: charity.description
              };
            });
            setCharities(charitiesWithDonations);
          } else {
            console.log('No charities found or API returned unexpected format');
            setCharities([]);
          }
        } catch (charityError) {
          console.error('Error fetching charities:', charityError);
          setCharities([]);
        }

      } catch (err) {
        console.error('Error fetching donor data:', err);
        setError('Failed to load dashboard data');
        
        // Fallback to empty arrays instead of mock data
        setDonations([]);
        setCharities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

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

  // Handle navigation to donation page
  const handleDonateNow = (charityId) => {
    navigate(`/donate?charity=${charityId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-main loading-state">
          <div className="spinner-loader"></div>
          <p>Loading your dashboard...</p>
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
        <div className="dashboard-main error-state">
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

  // Show access denied for non-donors
  if (!isAuthenticated || user?.role !== 'donor') {
    return (
      <>
        <Navbar />
        <div className="dashboard-main access-denied">
          <h2>Donor Dashboard Access</h2>
          <p>You need to be logged in as a donor to access this dashboard.</p>
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
      <div className="dashboard-main">
        <div className="dashboard-section-header">
          <h1>Donor Dashboard</h1>
          <p className="dashboard-welcome-text">Welcome back! Here's your giving overview.</p>
        </div>

        <div className="dashboard-stats-block">
          {stats.map((stat, i) => (
            <div key={i} className="stat-insight-card" style={{ borderTop: `4px solid ${stat.color}` }}>
              <div className="stat-icon-container" style={{ color: stat.color }}>
                {stat.icon}
              </div>
              <h3 className="stat-heading">{stat.title}</h3>
              <p className="stat-metric">{stat.value}</p>
              <p className="stat-delta" style={{ color: stat.change.startsWith('+') ? '#38a169' : '#e53e3e' }}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        <div className="dashboard-tab-selector">
          <button
            className={`donation-history-toggle ${activeTab === 'overview' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`donation-history-toggle ${activeTab === 'donations' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            My Donations
          </button>
          <button
            className={`donation-history-toggle ${activeTab === 'charities' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('charities')}
          >
            My Charities
          </button>
        </div>

        <div className="dashboard-tab-view">
          {activeTab === 'overview' && (
            <div className="dashboard-overview-tab">
              <div className="recent-donations-panel">
                <h2><FiDollarSign className="section-icon" /> Recent Donations</h2>
                {donations.length > 0 ? (
                  <>
                    <div className="donation-card-collection">
                      {donations.slice(0, 3).map(d => (
                        <div key={d.id} className="donation-entry-card">
                          <div className="entry-details">
                            <h3>{d.charity}</h3>
                            <p className={`donation-status-tag ${d.status}`}>{d.status}</p>
                          </div>
                          <div className="entry-meta">
                            <p className="donation-amount">${d.amount}</p>
                            <p className="donation-date">
                              <FiCalendar className="icon" />
                              {new Date(d.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      className="donation-list-expand-btn"
                      onClick={() => setActiveTab('donations')}
                    >
                      View All Donations →
                    </button>
                  </>
                ) : (
                  <div className="empty-donations">
                    <h3>No donations yet</h3>
                    <p>Start making a difference by supporting a charity today!</p>
                    <a href="/charity" className="empty-state-btn">
                      Browse Charities
                    </a>
                  </div>
                )}
              </div>

              <div className="charity-suggestions-panel">
                <h2>Recommended For You</h2>
                <div className="charity-card-grid">
                  {charities.filter(c => c.donated === 0).slice(0, 2).map(c => (
                    <div key={c.id} className="charity-suggestion-card">
                      <h3>{c.name}</h3>
                      <p className="charity-category-label">{c.category}</p>
                      <button 
                        className="primary-donation-cta"
                        onClick={() => handleDonateNow(c.id)}
                      >
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
            <div className="donation-history-tab">
              <h2><FiDollarSign className="section-icon" /> My Donation History</h2>
              {donations.length > 0 ? (
                <div className="donation-record-table">
                  <div className="table-header-row">
                    <span>Charity</span>
                    <span>Amount</span>
                    <span>Date</span>
                    <span>Status</span>
                  </div>
                  {donations.map(d => (
                    <div key={d.id} className="table-data-row">
                      <span>{d.charity}</span>
                      <span className="amount">${d.amount}</span>
                      <span>{new Date(d.date).toLocaleDateString()}</span>
                      <span className={`status-tag ${d.status}`}>{d.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-donations">
                  <h3>No donation history</h3>
                  <p>Your donation history will appear here once you make your first donation.</p>
                  <a href="/charity" className="empty-state-btn">
                    Make Your First Donation
                  </a>
                </div>
              )}
            </div>
          )}

          {activeTab === 'charities' && (
            <div className="charity-support-tab">
              <h2><FiHeart className="section-icon" /> Charities I Support</h2>
              {charities.filter(c => c.donated > 0).length > 0 ? (
                <div className="supported-charity-list">
                  {charities.filter(c => c.donated > 0).map(c => (
                    <div key={c.id} className="supported-charity-block">
                      <div className="charity-data">
                        <h3>{c.name}</h3>
                        <p className="charity-category-label">{c.category}</p>
                      </div>
                      <div className="donation-total-data">
                        <p className="total-donated-amount">Total donated: <span>${c.donated}</span></p>
                        <button 
                          className="repeat-donation-btn"
                          onClick={() => handleDonateNow(c.id)}
                        >
                          Donate Again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-charities">
                  <h3>No supported charities yet</h3>
                  <p>Once you make donations, the charities you support will appear here.</p>
                  <a href="/charity" className="empty-state-btn">
                    Find Charities to Support
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DonorDashboard;
