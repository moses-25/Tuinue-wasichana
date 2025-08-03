


import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiClock } from 'react-icons/fi';
import { charityAPI } from '../services/api';

const CharityApprovalList = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch charity applications from API
  useEffect(() => {
    const fetchCharityApplications = async () => {
      try {
        setLoading(true);
        const response = await charityAPI.getCharityApplications();
        if (response.success) {
          setCharities(response.applications || []);
        }
      } catch (err) {
        console.error('Error fetching charity applications:', err);
        setError('Failed to load charity applications');
      } finally {
        setLoading(false);
      }
    };

    fetchCharityApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      const response = await charityAPI.approveCharityApplication(id);
      if (response.success) {
        setCharities(charities.map(charity => 
          charity.id === id ? { ...charity, status: 'approved' } : charity
        ));
      }
    } catch (err) {
      console.error('Error approving charity:', err);
      setError('Failed to approve charity application');
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await charityAPI.rejectCharityApplication(id);
      if (response.success) {
        setCharities(charities.map(charity => 
          charity.id === id ? { ...charity, status: 'rejected' } : charity
        ));
      }
    } catch (err) {
      console.error('Error rejecting charity:', err);
      setError('Failed to reject charity application');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheck className="text-green-500" />;
      case 'rejected': return <FiX className="text-red-500" />;
      case 'pending': return <FiClock className="text-yellow-500" />;
      default: return <FiAlertCircle />;
    }
  };

  // Filter charities based on selected filter
  const filteredCharities = charities.filter(charity => {
    if (filter === 'all') return true;
    return charity.status === filter;
  });

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <div className="charity-approval">
        <h2 className="section-title">Charity Applications</h2>
        <div className="loading">Loading charity applications...</div>
      </div>
    );
  }

  return (
    <div className="charity-approval">
      <h2 className="section-title">Charity Applications</h2>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      <div className="approval-filters">
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All ({charities.length})
        </button>
        <button 
          className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => handleFilterChange('pending')}
        >
          Pending ({charities.filter(c => c.status === 'pending').length})
        </button>
        <button 
          className={`filter-button ${filter === 'approved' ? 'active' : ''}`}
          onClick={() => handleFilterChange('approved')}
        >
          Approved ({charities.filter(c => c.status === 'approved').length})
        </button>
        <button 
          className={`filter-button ${filter === 'rejected' ? 'active' : ''}`}
          onClick={() => handleFilterChange('rejected')}
        >
          Rejected ({charities.filter(c => c.status === 'rejected').length})
        </button>
      </div>

      <div className="charity-list">
        {filteredCharities.length === 0 ? (
          <div className="no-applications">
            <p>No charity applications found.</p>
          </div>
        ) : (
          filteredCharities.map(charity => (
            <div key={charity.id} className="charity-card">
            <div className="charity-info">
              <h3>{charity.organization_name}</h3>
              <p className="mission">{charity.mission}</p>
              <div className="charity-meta">
                <span>Submitted: {new Date(charity.submitted_at).toLocaleDateString()}</span>
                <span className="status">
                  {getStatusIcon(charity.status)} {charity.status}
                </span>
              </div>
            </div>
            
            {charity.status === 'pending' && (
              <div className="approval-actions">
                <button 
                  className="approve-button"
                  onClick={() => handleApprove(charity.id)}
                >
                  <FiCheck /> Approve
                </button>
                <button 
                  className="reject-button"
                  onClick={() => handleReject(charity.id)}
                >
                  <FiX /> Reject
                </button>
              </div>
            )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CharityApprovalList;