import '../Pages/Dashboards/CharityDashboard.css';

const DonationList = ({ donations, charities }) => {
  return (
    <div>
      <h2 className="cd-section-title">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        Recent Donations
      </h2>
      
      <table className="cd-donations-table">
        <thead>
          <tr>
            <th>Donor</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Charity</th>
          </tr>
        </thead>
        <tbody>
          {donations.map(donation => (
            <tr key={donation.id}>
              <td>{donation.donor}</td>
              <td className="cd-donation-amount">${donation.amount}</td>
              <td>{new Date(donation.date).toLocaleDateString()}</td>
              <td>
                <span className={`cd-donation-status ${donation.status}`}>
                  {donation.status}
                </span>
              </td>
              <td>
                {charities.find(c => c.id === donation.charityId)?.name || 'General Fund'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationList;