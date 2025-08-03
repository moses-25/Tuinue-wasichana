


import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

const CharitiesTable = ({ charities, onApprove, onReject, onDelete }) => {
  console.log('CharitiesTable received charities:', charities);
  
  return (
    <div className="charities-table">
      <h2>Charity Applications</h2>
      
      {charities && charities.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Mission</th>
              <th>Status</th>
              <th>Submitted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {charities.map(charity => (
              <tr key={charity.id}>
                <td>{charity.name}</td>
                <td className="mission-cell" title={charity.mission}>
                  {charity.mission ? charity.mission.substring(0, 100) + (charity.mission.length > 100 ? '...' : '') : 'N/A'}
                </td>
                <td>
                  <span className={`status-badge ${charity.status}`}>
                    {charity.status}
                  </span>
                </td>
                <td>
                  {charity.createdAt ? new Date(charity.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="actions">
                  {charity.status === 'pending' && (
                    <>
                      <button 
                        className="approve-btn"
                        onClick={() => onApprove(charity.id)}
                        title="Approve this charity application"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button 
                        className="reject-btn"
                        onClick={() => onReject(charity.id)}
                        title="Reject this charity application"
                      >
                        <FiX /> Reject
                      </button>
                    </>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={() => onDelete(charity.id)}
                    title="Delete this charity application"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-applications">
          <p>No charity applications found.</p>
          <p>Applications will appear here when users submit them through the "Apply as Charity" page.</p>
        </div>
      )}
    </div>
  );
};

export default CharitiesTable;