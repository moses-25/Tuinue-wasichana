import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import './About.css';

const About = () => {
  return (
    <>
      <Navbar />
      <section className="about-hero">
        <div className="container">
          <h1 className="about-title">How You Can Change a Girl's Life</h1>
          <p className="about-subtitle">Your simple actions create lasting impact. Here's how:</p>
        </div>
      </section>

      <section className="about-steps">
        <div className="container">
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Choose Your Impact</h3>
              <p>Select exactly how you want to help — education, nutrition, or safety. Every option directly benefits a girl in need.</p>
              <Button to="/charity" variant="text">View Causes</Button>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Make Your Donation</h3>
              <p>Give any amount — $50 educates a girl for a month, $300 provides a year of school supplies. Every dollar counts.</p>
              <Button to="/donate" variant="text">Donate Now</Button>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>See Your Impact</h3>
              <p>Receive updates showing exactly which girl you helped and how her life is changing through your support.</p>
              <Button to="/stories" variant="text">Read Stories</Button>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Multiply Your Effect</h3>
              <p>Share your action and encourage friends to join. Together we can help more girls thrive.</p>
              <Button to="/share" variant="text">Share Now</Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default About;
