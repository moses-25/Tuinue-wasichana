


import { useState } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiClock } from 'react-icons/fi';

const CharityApprovalList = () => {
  const [charities, setCharities] = useState([
    { id: 1, name: 'Animal Rescue', email: 'contact@animalrescue.org', status: 'pending', submitted: '2023-05-10' },
    { id: 2, name: 'Community Kitchen', email: 'info@communitykitchen.org', status: 'pending', submitted: '2023-05-08' },
    { id: 3, name: 'Green Earth', email: 'support@greenearth.org', status: 'pending', submitted: '2023-05-05' },
    { id: 4, name: 'Tech for Good', email: 'hello@techforgood.org', status: 'rejected', submitted: '2023-05-01' },
    { id: 5, name: 'Books for All', email: 'admin@booksforall.org', status: 'approved', submitted: '2023-04-28' }
  ]);

  const handleApprove = (id) => {
    setCharities(charities.map(charity => 
      charity.id === id ? { ...charity, status: 'approved' } : charity
    ));
  };

  const handleReject = (id) => {
    setCharities(charities.map(charity => 
      charity.id === id ? { ...charity, status: 'rejected' } : charity
    ));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheck className="text-green-500" />;
      case 'rejected': return <FiX className="text-red-500" />;
      case 'pending': return <FiClock className="text-yellow-500" />;
      default: return <FiAlertCircle />;
    }
  };

  return (
    <div className="charity-approval">
      <h2 className="section-title">Charity Applications</h2>
      
      <div className="approval-filters">
        <button className="filter-button active">All</button>
        <button className="filter-button">Pending</button>
        <button className="filter-button">Approved</button>
        <button className="filter-button">Rejected</button>
      </div>

      <div className="charity-list">
        {charities.map(charity => (
          <div key={charity.id} className="charity-card">
            <div className="charity-info">
              <h3>{charity.name}</h3>
              <p>{charity.email}</p>
              <div className="charity-meta">
                <span>Submitted: {charity.submitted}</span>
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
        ))}
      </div>
    </div>
  );
};

export default CharityApprovalList;