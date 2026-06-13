


import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

const CharitiesTable = ({ charities, onApprove, onReject, onDelete }) => {
  return (
    <div className="charities-table">
      <h2>Charity Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {charities.map(charity => (
            <tr key={charity.id}>
              <td>{charity.name}</td>
              <td>{charity.email}</td>
              <td>
                <span className={`status-badge ${charity.status}`}>
                  {charity.status}
                </span>
              </td>
              <td className="actions">
                {charity.status === 'pending' && (
                  <>
                    <button 
                      className="approve-btn"
                      onClick={() => onApprove(charity.id)}
                    >
                      <FiCheck /> Approve
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={() => onReject(charity.id)}
                    >
                      <FiX /> Reject
                    </button>
                  </>
                )}
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(charity.id)}
                >
                  <FiTrash2 /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CharitiesTable;