import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import './Charities.css';

const Charities = () => {
  return (
    <>
      <Navbar />
      
      <main className="charities-page">
        <div className="container">
          <section className="browse-section">
            <div className="browse-header">
              <div className="browse-text">
                <h2>Browse Charities</h2>
                <p className="charity-subtitle">Find and support charities working to improve menstrual health and education for girls</p>
              </div>
              <div className="browse-actions">
                <Link to="/apply-charity" className="apply-charity-btn">
                  Apply as a Charity
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Charities;