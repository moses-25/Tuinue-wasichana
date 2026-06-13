import React from 'react';
import './ProgramCard.css';

const ProgramCard = ({ program }) => {
  return (
    <div className="program-card">
      <div className="program-image">
        <img src={program?.image || '/placeholder-program.jpg'} alt={program?.title || 'Program'} />
      </div>
      <div className="program-content">
        <h3>{program?.title || 'Program Title'}</h3>
        <p>{program?.description || 'Program description goes here...'}</p>
        <div className="program-details">
          <span className="program-category">{program?.category || 'Category'}</span>
          <span className="program-duration">{program?.duration || '6 months'}</span>
        </div>
        <button className="learn-more-btn">Learn More</button>
      </div>
    </div>
  );
};

const ProgramCards = ({ programs = [] }) => {
  const defaultPrograms = [
    {
      id: 1,
      title: 'Youth Mentorship',
      description: 'Connecting young people with experienced mentors',
      category: 'Education',
      duration: '12 months',
      image: '/mentorship-program.jpg'
    },
    {
      id: 2,
      title: 'Skills Training',
      description: 'Vocational training for sustainable employment',
      category: 'Employment',
      duration: '6 months',
      image: '/skills-program.jpg'
    },
    {
      id: 3,
      title: 'Community Gardens',
      description: 'Building sustainable food sources in communities',
      category: 'Environment',
      duration: 'Ongoing',
      image: '/garden-program.jpg'
    }
  ];

  const displayPrograms = programs.length > 0 ? programs : defaultPrograms;

  return (
    <div className="program-cards-container">
      <h2>Our Programs</h2>
      <div className="program-cards-grid">
        {displayPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>
    </div>
  );
};

export default ProgramCards;