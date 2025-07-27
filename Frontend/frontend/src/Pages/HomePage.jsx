import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from '../components/Footer';
import FAQ from '../components/FAQItem';
import './HomePage.css';


const HomePage = () => {
  // Featured charities data
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

      {/* How You Can Help Section */}
      <section className="how-section">
        <div className="container">
          <h2 className="section-title">How You Can Change a Girl's Life</h2>
          <p className="section-subtitle">Your simple actions create lasting impact. Here's how:</p>
          
          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Choose Your Impact</h3>
              <p>Select exactly how you want to help - education, nutrition, or safety. Every option directly benefits a girl in need.</p>
              <Link to="/causes" className="step-link">View Causes →</Link>
            </div>
            
            {/* Step 2 */}
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Make Your Donation</h3>
              <p>Give any amount - $50 educates a girl for a month, $300 provides a year of school supplies. Every dollar counts.</p>
              <Link to="/donate" className="step-link">Donate Now →</Link>
            </div>
            
            {/* Step 3 */}
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>See Your Impact</h3>
              <p>Receive updates showing exactly which girl you helped and how her life is changing through your support.</p>
              <Link to="/stories" className="step-link">Read Stories →</Link>
            </div>
            
            {/* Step 4 */}
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Multiply Your Effect</h3>
              <p>Share your action on social media and encourage friends to join. Together we can help more girls thrive.</p>
              <Link to="/share" className="step-link">Share Now →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Charities Section */}
      <section className="featured-charities-section">
        <div className="container">
          <div className="charities-header">
            <h2 className="charities-title">Featured Charities Making a Difference</h2>
            <Link to="/cha" className="view-all-link">
              View All Charities →
            </Link>
          </div>
          <p className="charities-subtitle">Support these organizations changing girls' lives every day</p>
          
          <div className="charities-grid">
            {featuredCharities.map(charity => (
              <div key={charity.id} className="charity-card">
                <div className="charity-tag">{charity.category}</div>
                <h3 className="charity-name">{charity.name}</h3>
                <p className="charity-description">{charity.description}</p>
                <div className="charity-impact">
                  <span className="impact-icon"></span> {charity.impact}
                </div>
                <Link to={`/charities/${charity.id}`} className="charity-button">
                  Support This Cause
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FAQ />
      <Footer />
    </>
  );
};

export default HomePage;