// DonorDashboard.jsx
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

  useEffect(() => {
    const fetchData = async () => {
      await new Promise(res => setTimeout(res, 1000));
      setDonations([
        { id: 1, charity: 'Education Fund', amount: 100, date: '2023-06-15', status: 'completed' },
        { id: 2, charity: 'Medical Aid', amount: 50, date: '2023-06-10', status: 'completed' },
        { id: 3, charity: 'Animal Rescue', amount: 75, date: '2023-06-05', status: 'pending' }
      ]);
      setCharities([
        { id: 1, name: 'Education Fund', category: 'Education', donated: 100 },
        { id: 2, name: 'Medical Aid', category: 'Health', donated: 50 },
        { id: 3, name: 'Animal Rescue', category: 'Animals', donated: 75 },
        { id: 4, name: 'Clean Water', category: 'Environment', donated: 0 }
      ]);
      setLoading(false);
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
      <div className="dashboard-main loading-state">
        <div className="spinner-loader"></div>
        <p>Loading your dashboard...</p>
      </div>
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
                <button className="donation-list-expand-btn">View All Donations →</button>
              </div>

              <div className="charity-suggestions-panel">
                <h2>Recommended For You</h2>
                <div className="charity-card-grid">
                  {charities.filter(c => c.donated === 0).slice(0, 2).map(c => (
                    <div key={c.id} className="charity-suggestion-card">
                      <h3>{c.name}</h3>
                      <p className="charity-category-label">{c.category}</p>
                      <button className="primary-donation-cta">
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
            </div>
          )}

          {activeTab === 'charities' && (
            <div className="charity-support-tab">
              <h2><FiHeart className="section-icon" /> Charities I Support</h2>
              <div className="supported-charity-list">
                {charities.filter(c => c.donated > 0).map(c => (
                  <div key={c.id} className="supported-charity-block">
                    <div className="charity-data">
                      <h3>{c.name}</h3>
                      <p className="charity-category-label">{c.category}</p>
                    </div>
                    <div className="donation-total-data">
                      <p className="total-donated-amount">Total donated: <span>${c.donated}</span></p>
                      <button className="repeat-donation-btn">Donate Again</button>
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
