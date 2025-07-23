import { Link } from 'react-router-dom';
import './CharityCard.css';

const CharityCards = () => {
  const causes = [
    {
      id: 1,
      title: "Girls' Education Fund",
      description: "Sponsor a girl's complete education for one year including tuition, books, uniforms, and mentorship programs.",
      amount: "$150",
      impact: "Educates 1 girl for a full year",
      progress: 75,
      urgency: "High Need"
    },
    {
      id: 2,
      title: "School Infrastructure",
      description: "Build safe learning spaces with proper classrooms, sanitation facilities, and technology access.",
      amount: "$500",
      impact: "Supports 50+ students",
      progress: 40,
      urgency: "Ongoing Project"
    },
    {
      id: 3,
      title: "Nutrition Program",
      description: "Provide daily nutritious meals to help girls focus on learning instead of hunger.",
      amount: "$100",
      impact: "Feeds 10 students for a month",
      progress: 60,
      urgency: "Critical Need"
    }
  ];

  return (
    <section className="charity-section">
      <div className="section-header">
        <h2 className="section-title">Transform Lives Through Giving</h2>
        <p className="section-subtitle">Your donation directly impacts girls' education in underserved communities</p>
      </div>
      
      <div className="charity-cards-container">
        <div className="charity-cards">
          {causes.map((cause) => (
            <div key={cause.id} className="charity-card">
              <div className="card-header">
                <h3 className="card-title">{cause.title}</h3>
                <span className="urgency-tag">{cause.urgency}</span>
              </div>
              
              <p className="card-description">{cause.description}</p>
              
              <div className="impact-details">
                <div className="impact-item">
                  <span className="impact-label">Donation Impact:</span>
                  <span className="impact-value">{cause.impact}</span>
                </div>
                <div className="impact-item">
                  <span className="impact-label">Suggested Amount:</span>
                  <span className="impact-value highlight">{cause.amount}</span>
                </div>
              </div>
              
              <div className="progress-section">
                <div className="progress-container">
                  <div 
                    className="progress-bar"
                    style={{ width: `${cause.progress}%` }}
                  ></div>
                </div>
                <div className="progress-text">{cause.progress}% of goal reached</div>
              </div>
              
              <Link 
                to={`/donate?cause=${cause.id}`} 
                className="donate-button"
              >
                Donate To This Cause
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CharityCards;