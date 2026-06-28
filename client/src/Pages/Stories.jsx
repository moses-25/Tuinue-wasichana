import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import Story from '../components/StoryCard';
import StorySubmissionForm from '../components/StorySubmissionForm';
import { useAuth } from '../contexts/AuthContext';
import './Stories.css';

const Stories = () => {
  const { user, isAuthenticated } = useAuth();
  const isCharity = isAuthenticated && user?.role === 'charity';

  return (
    <>
      <Navbar />
      <main className="stories-page">
        <section className="stories-hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1>Success Stories</h1>
            <p>
              Every girl supported becomes a story of hope, resilience, and transformation.
              Read how Tuinue Wasichana is changing lives across Kenya.
            </p>
            <div className="hero-actions">
              <Link to="/charity" className="hero-btn primary">Support a Girl</Link>
              <Link to="/about" className="hero-btn secondary">Learn More</Link>
            </div>
          </div>
        </section>

        <section className="stories-toolbar-section">
          <Story />
        </section>

        {isCharity && (
          <section className="stories-submit-section">
            <div className="submit-inner">
              <h2>Share Your Impact</h2>
              <p>
                If you're a charity partner, share the success stories of the girls
                you've supported. Inspire others to join the cause.
              </p>
              <StorySubmissionForm />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Stories;
