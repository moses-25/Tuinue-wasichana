import { Link } from 'react-router-dom';
import './HeroSection.css';
import heroImg from '../assets/images/image 1.jpg'; 


const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Empower a Girl, Transform a Nation</h1>
          <h2>With Tuinue Wasichana, every donation helps break the cycle of poverty through education</h2>
          <div className="hero-cta">
            <Link to="/charity" className="cta-button primary">Donate Now</Link>
          </div>
        </div>
        <div className="hero-image">
            <img 
            src={heroImg} 
            alt="Empowered girl smiling"
            className="hero-img"
            />
        </div>
      </div>

    </section>
  );
};

export default HeroSection;