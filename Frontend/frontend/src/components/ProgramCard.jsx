import { Link } from 'react-router-dom';
import { FiBook, FiUsers, FiAward, FiHeart } from 'react-icons/fi';
import './ProgramCard.css';

const ProgramCards = () => {
  const programs = [
    {
      id: 1,
      title: "Primary Education",
      description: "Quality basic education for girls aged 6-13 with trained teachers and learning materials",
      icon: <FiBook className="program-icon" />,
      duration: "6-12 years",
      beneficiaries: "5,000+ girls",
      cta: "Enroll Now"
    },
    {
      id: 2,
      title: "Mentorship Program",
      description: "Pairing students with professional women mentors in STEM and business fields",
      icon: <FiUsers className="program-icon" />,
      duration: "2 year program",
      beneficiaries: "800+ matches",
      cta: "Become a Mentor"
    },
    {
      id: 3,
      title: "STEM Scholars",
      description: "Advanced science and technology training with university partnerships",
      icon: <FiAward className="program-icon" />,
      duration: "4 year scholarship",
      beneficiaries: "120 scholars",
      cta: "Apply Now"
    },
    {
      id: 4,
      title: "Health & Wellness",
      description: "Nutrition education and menstrual health programs to keep girls in school",
      icon: <FiHeart className="program-icon" />,
      duration: "Ongoing",
      beneficiaries: "3,200+ served",
      cta: "Support Health"
    }
  ];

  return (
    <section className="programs-section">
      <div className="section-header">
        <h2>Our Transformative Programs</h2>
        <p>Each initiative is designed to break barriers in girls' education</p>
      </div>

      <div className="program-cards">
        {programs.map((program) => (
          <div key={program.id} className="program-card">
            <div className="card-header">
              <div className="icon-circle">
                {program.icon}
              </div>
              <h3>{program.title}</h3>
            </div>
            
            <p className="program-description">{program.description}</p>
            
            <div className="program-details">
              <div className="detail-item">
                <span>Duration:</span>
                <strong>{program.duration}</strong>
              </div>
              <div className="detail-item">
                <span>Beneficiaries:</span>
                <strong>{program.beneficiaries}</strong>
              </div>
            </div>
            
            <Link 
              to={`/programs/${program.id}`} 
              className="program-cta"
            >
              {program.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProgramCards;