import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import './HomePage.css';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />

      {/* How You Can Help Section */}
      <section className="how">
        <div className="container">
          <h2 className="section-title">How You Can Change a Girl's Life</h2>
          <p className="section-subtitle">Your simple actions create lasting impact. Here's how:</p>
          
          <div className="steps-container">
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
          
          <div className="impact-note">
            <p><strong>Real change starts with you.</strong> Right now, 100+ girls are waiting for someone like you to change their future.</p>
            <Link to="/donate" className="primary-button">Be Their Hero Today</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;