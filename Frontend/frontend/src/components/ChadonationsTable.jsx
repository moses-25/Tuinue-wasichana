import React from 'react';

export default function DonationsTable({ data }) {
  return (
    <table className="donations-table">
      <thead>
        <tr>
          <th>Donor</th>
          <th>Charity</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((donation, idx) => (
          <tr key={idx}>
            <td>{donation.donor}</td>
            <td>{donation.charity}</td>
            <td>${donation.amount}</td>
            <td>{donation.date}</td>
            <td>{donation.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
