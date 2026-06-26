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
          <div className="impact-section-header">
            <h2 className="impact-title">The power of your sponsorship</h2>
            <p className="impact-subtitle">
              When you sponsor a girl, you fund life-changing projects in her community—projects 
              that help girls access their basic human rights, education, and opportunities for a brighter future.
            </p>
          </div>

          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-icon impact-icon-nutrition">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" fill="currentColor" opacity="0.2"/>
                  <path d="M24 28C26.2091 28 28 26.2091 28 24C28 21.7909 26.2091 20 24 20C21.7909 20 20 21.7909 20 24C20 26.2091 21.7909 28 24 28Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M24 16V12M24 36V32M32 24H36M12 24H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="impact-content">
                <h3>Adequate nutrition</h3>
                <p>
                  Malnutrition can stunt girls' development and pull them away from education. 
                  With your support, we provide sustainable meal programs, nutritious food supplies, 
                  and emergency vouchers ensuring girls have the energy to learn and thrive.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-water">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 44C30.6274 44 36 38.6274 36 32C36 25.3726 24 12 24 12C24 12 12 25.3726 12 32C12 38.6274 17.3726 44 24 44Z" fill="currentColor" opacity="0.2"/>
                  <path d="M24 44C30.6274 44 36 38.6274 36 32C36 25.3726 24 12 24 12C24 12 12 25.3726 12 32C12 38.6274 17.3726 44 24 44Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="impact-content">
                <h3>Water and sanitation</h3>
                <p>
                  Girls often carry the burden of water collection which can mean traveling long distances, 
                  missing school and being exposed to risky situations. Help girls, families and entire communities 
                  gain access to safe, clean water and proper sanitation facilities.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-health">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="20" fill="currentColor" opacity="0.2"/>
                  <path d="M24 16V32M16 24H32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="impact-content">
                <h3>Health care</h3>
                <p>
                  Each year, thousands of girls face preventable illnesses. Together with our partners, 
                  we work to improve health care access for mothers and children, provide essential medical 
                  supplies, and ensure girls have the healthiest start in life.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-education">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 20L24 12L40 20L24 28L8 20Z" fill="currentColor" opacity="0.2"/>
                  <path d="M8 20L24 12L40 20M8 20L24 28M8 20V28L24 36M40 20L24 28M40 20V28L24 36M24 28V36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="impact-content">
                <h3>Education</h3>
                <p>
                  When you sponsor a girl, you help build new schools and work with communities to 
                  promote the importance of sending and keeping girls in school. Education is the foundation 
                  for breaking the cycle of poverty and creating lasting change.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-income">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="20" fill="currentColor" opacity="0.2"/>
                  <path d="M24 16V32M20 20H26C27.1046 20 28 20.8954 28 22C28 23.1046 27.1046 24 26 24H22C20.8954 24 20 24.8954 20 26C20 27.1046 20.8954 28 22 28H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="impact-content">
                <h3>Family income</h3>
                <p>
                  Child sponsors help support vocational skills training for youth and families. 
                  These programs offer apprenticeships, helping them gain employment and giving their 
                  families income-making power over their lives and futures.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-protection">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4L8 12V24C8 33.6 14.4 42.4 24 44C33.6 42.4 40 33.6 40 24V12L24 4Z" fill="currentColor" opacity="0.2"/>
                  <path d="M24 4L8 12V24C8 33.6 14.4 42.4 24 44C33.6 42.4 40 33.6 40 24V12L24 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  <path d="M20 24L22.5 27L28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="impact-content">
                <h3>Child protection</h3>
                <p>
                  We work to ensure that all girls are protected and safe. Without help protecting children, 
                  they can't prove their legal age or claim protection under any legislation. Birth certificates 
                  also enable girls to gain access to critical services and resources they need.
                </p>
              </div>
            </div>
          </div>

          <div className="impact-cta">
            <Button to="/charity" variant="primary" size="lg">
              View All Our Programs
            </Button>
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
