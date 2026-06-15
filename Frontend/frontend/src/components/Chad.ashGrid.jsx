import React from 'react';

export default function StatsGrid({ charities, donations }) {
  const totalCharities = charities.length;
  const totalRaised = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const ongoing = charities.filter(c => c.status === 'Active').length;
  const totalDonations = donations.length;

  const card = (label, value) => (
    <div className="stats-card">
      <h4>{label}</h4>
      <p>{value}</p>
    </div>
  );

  return (
    <div className="stats-grid">
      {card("Total Charities", totalCharities)}
      {card("Total Raised", `$${totalRaised}`)}
      {card("Ongoing Campaigns", ongoing)}
      {card("Donations Received", totalDonations)}
    </div>
  );
}
