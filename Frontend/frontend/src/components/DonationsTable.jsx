import { FiDollarSign, FiTrash } from 'react-icons/fi';

const DonationsTable = ({ donations, onDelete }) => {
  return (
    <div className="donations-table">
      <h2>Donation Records</h2>
      <table>
        <thead>
          <tr>
            <th>Donor</th>
            <th>Charity</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {donations.map(donation => (
            <tr key={donation.id}>
              <td>{donation.donor}</td>
              <td>{donation.charity}</td>
              <td>
                <span className="donation-amount">
                  <FiDollarSign className="amount-icon" /> ${donation.amount}
                </span>
              </td>
              <td>{new Date(donation.date).toLocaleDateString()}</td>
              <td>
                <span className={`status-badge ${donation.status}`}>
                  {donation.status}
                </span>
              </td>
              <td>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(donation.id)}
                >
                  <FiTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationsTable;
