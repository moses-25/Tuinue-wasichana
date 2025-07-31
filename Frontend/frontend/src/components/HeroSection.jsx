import { Link } from 'react-router-dom';
import './HeroSection.css';
import heroimg from'../assets/images/hero.jpg';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Empower a Girl, Transform a Nation</h1>
          <h2>With Tuinue Wasichana, every donation helps break the cycle of poverty through education</h2>
          <div className="hero-cta">
            <Link to="/charity" className="cta-button primary">Donate Now</Link>
            <Link to="/stories" className="cta-button secondary">See The Positively Impacted Ladies</Link>
          </div>
        </div>
        <div className="hero-image">
            <img 
            src={heroimg} 
            alt="Empowered girl smiling"
            className="hero-img"
            />
        </div>
      </div>
      
      <div className="impact-stats">
        <div className="stat-item">
          <span className="stat-number">5,000+</span>
          <span className="stat-label">Girls Educated</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">120+</span>
          <span className="stat-label">Schools Supported</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">15</span>
          <span className="stat-label">Communities Transformed</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;