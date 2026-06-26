import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from '../components/Footer';
import FAQ from '../components/FAQItem';
import Button from '../components/Button';
import ImpactNote from '../components/ImpactNote';
import './HomePage.css';

// Import SVG icons
import child1 from '../assets/child1.svg';
import child2 from '../assets/child2.svg';
import child3 from '../assets/child3.svg';
import child4 from '../assets/child4.svg';
import child5 from '../assets/child5.svg';
import child6 from '../assets/child6.svg';

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
            <h2 className="impact-title">Your donation creates real change</h2>
            <p className="impact-subtitle">
              Every contribution to Tuinue Wasichana directly supports girls in Kenya through comprehensive programs 
              that address the root causes of poverty and create pathways to success. Here's how your generosity makes a difference.
            </p>
          </div>

          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-icon impact-icon-nutrition">
                <img src={child1} alt="Nutrition support icon" />
              </div>
              <div className="impact-content">
                <h3>Nutrition support</h3>
                <p>
                  We partner with local schools to provide nutritious meals that fuel learning. 
                  Hungry girls can't focus on their studies. Your support ensures they receive the daily 
                  nutrition they need to attend school, concentrate in class, and reach their full potential.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-water">
                <img src={child2} alt="Clean water access icon" />
              </div>
              <div className="impact-content">
                <h3>Clean water access</h3>
                <p>
                  Many girls miss school to fetch water for their families. We work with communities 
                  to establish clean water sources near schools and homes, giving girls back their time 
                  to focus on education and reducing health risks from contaminated water.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-health">
                <img src={child3} alt="Healthcare and hygiene icon" />
              </div>
              <div className="impact-content">
                <h3>Healthcare and hygiene</h3>
                <p>
                  Lack of menstrual hygiene products forces many girls to miss school monthly. 
                  We provide hygiene kits, basic healthcare education, and partner with local clinics 
                  to ensure girls stay healthy, confident, and never miss a day of learning.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-education">
                <img src={child4} alt="Educational resources icon" />
              </div>
              <div className="impact-content">
                <h3>Educational resources</h3>
                <p>
                  From textbooks to uniforms, school fees to tutoring programs—we provide everything 
                  a girl needs to succeed in school. Your donations remove financial barriers that 
                  prevent families from prioritizing their daughters' education.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-income">
                <img src={child5} alt="Economic empowerment icon" />
              </div>
              <div className="impact-content">
                <h3>Economic empowerment</h3>
                <p>
                  We offer vocational training and microfinance programs for mothers and older girls, 
                  creating income opportunities that lift entire families. When mothers earn, they invest 
                  in their daughters' futures, creating a cycle of empowerment.
                </p>
              </div>
            </div>

            <div className="impact-item">
              <div className="impact-icon impact-icon-protection">
                <img src={child6} alt="Safety and mentorship icon" />
              </div>
              <div className="impact-content">
                <h3>Safety and mentorship</h3>
                <p>
                  Girls face unique challenges and dangers on their path to education. We provide 
                  safe spaces, mentorship programs with successful women role models, and advocacy 
                  to protect girls' rights and ensure they can learn without fear.
                </p>
              </div>
            </div>
          </div>

          <div className="impact-cta">
            <Button to="/charity" variant="primary" size="lg">
              Support Our Programs
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
