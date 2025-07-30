


import { FiCheck, FiX, FiAlertTriangle, FiUser, FiShield } from 'react-icons/fi';

const PermissionRequests = () => {
  const [requests, setRequests] = useState([
    { id: 1, user: 'john.doe@example.com', request: 'Admin access', status: 'pending', date: '2023-05-15' },
    { id: 2, user: 'alice.smith@example.com', request: 'Charity manager', status: 'pending', date: '2023-05-14' },
    { id: 3, user: 'bob.johnson@example.com', request: 'Content moderator', status: 'approved', date: '2023-05-10' },
    { id: 4, user: 'emma.wilson@example.com', request: 'Data export', status: 'rejected', date: '2023-05-08' }
  ]);

  const handleApprove = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
  };

  const handleReject = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
  };

  return (
    <div className="permission-requests">
      <h2 className="section-title">Permission Requests</h2>
      
      <div className="requests-list">
        {requests.map(request => (
          <div key={request.id} className="request-card">
            <div className="request-icon">
              <FiShield />
            </div>
            
            <div className="request-details">
              <div className="user-info">
                <FiUser className="user-icon" />
                <span>{request.user}</span>
              </div>
              <p className="request-type">{request.request}</p>
              <div className="request-meta">
                <span className="date">{request.date}</span>
                <span className={`status ${request.status}`}>
                  {request.status}
                </span>
              </div>
            </div>
            
            {request.status === 'pending' && (
              <div className="request-actions">
                <button 
                  className="approve-button"
                  onClick={() => handleApprove(request.id)}
                >
                  <FiCheck /> Approve
                </button>
                <button 
                  className="reject-button"
                  onClick={() => handleReject(request.id)}
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

export default PermissionRequests;