import React from 'react';

const CharityCard = ({ charity }) => {
  return (
    <div className="charity-card">
      <div className="charity-image">
        <img src={charity?.image || '/placeholder-charity.jpg'} alt={charity?.name || 'Charity'} />
      </div>
      <div className="charity-content">
        <h3>{charity?.name || 'Charity Name'}</h3>
        <p>{charity?.description || 'Charity description goes here...'}</p>
        <div className="charity-stats">
          <span>Goal: ${charity?.goal || '10,000'}</span>
          <span>Raised: ${charity?.raised || '5,000'}</span>
        </div>
        <button className="donate-btn">Donate Now</button>
      </div>
    </div>
  );
};

const CharityCards = ({ charities = [] }) => {
  const defaultCharities = [
    {
      id: 1,
      name: 'Education for All',
      description: 'Providing quality education to underprivileged children',
      goal: 50000,
      raised: 32000,
      image: '/education-charity.jpg'
    },
    {
      id: 2,
      name: 'Clean Water Initiative',
      description: 'Bringing clean water to rural communities',
      goal: 75000,
      raised: 45000,
      image: '/water-charity.jpg'
    },
    {
      id: 3,
      name: 'Healthcare Access',
      description: 'Medical care for those who need it most',
      goal: 100000,
      raised: 68000,
      image: '/healthcare-charity.jpg'
    }
  ];

  const displayCharities = charities.length > 0 ? charities : defaultCharities;

  return (
    <div className="charity-cards-container">
      <h2>Featured Charities</h2>
      <div className="charity-cards-grid">
        {displayCharities.map((charity) => (
          <CharityCard key={charity.id} charity={charity} />
        ))}
      </div>
    </div>
  );
};

export default CharityCards;