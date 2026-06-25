import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from '../components/Footer';
import FAQ from '../components/FAQItem';
import Button from '../components/Button';
import ImpactNote from '../components/ImpactNote';
import './HomePage.css';

const HomePage = () => {
  const featuredCharities = [
    {
      id: 1,
      name: "Girls Education Initiative",
      description: "Providing scholarships and school supplies for girls in developing countries",
      impact: "500+ girls educated annually",
      category: "Education"
    },
    {
      id: 2,
      name: "Safe Spaces Foundation",
      description: "Creating safe environments and mentorship programs for at-risk girls",
      impact: "200+ shelters established worldwide",
      category: "Safety"
    },
    {
      id: 3,
      name: "Nutrition for Her",
      description: "Ensuring proper nutrition for girls' healthy development",
      impact: "10,000+ meals served monthly",
      category: "Health"
    }
  ];

  return (
    <>
      <Navbar />
      <HeroSection />

      <section className="featured-charities-section">
        <div className="container">
          <div className="charities-header">
            <h2 className="charities-title">Featured Charities Making a Difference</h2>
            <Button to="/charity" variant="text">View All Charities</Button>
          </div>
          <p className="charities-subtitle">Support these organizations changing girls' lives every day</p>

          <div className="charities-grid">
            {featuredCharities.map(charity => (
              <div key={charity.id} className="charity-card">
                <div className="charity-tag">{charity.category}</div>
                <h3 className="charity-name">{charity.name}</h3>
                <p className="charity-description">{charity.description}</p>
                <div className="charity-impact">
                  <span className="impact-icon" /> {charity.impact}
                </div>
                <Button to="/donate" variant="primary" size="sm" className="charity-button">
                  Support This Cause
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
      <ImpactNote
        message="Real change starts with you. Right now, 100+ girls are waiting for someone like you to change their future."
        ctaText="Be Their Hero Today"
        ctaLink="/charity"
      />
      <Footer />
    </>
  );
};

export default HomePage;
