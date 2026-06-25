import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Button from '../../components/Button';
import './About.css';

const About = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Section with Editorial Typography */}
      <section className="about-hero-editorial">
        <div className="container">
          <p className="hero-label">ABOUT</p>
          <h1 className="hero-title-main">
            We don't just follow trends—<br />
            <em>we set the rules.</em>
          </h1>
          <div className="hero-description-grid">
            <p className="hero-desc-left">
              At Tuinue Wasichana, we believe every girl deserves the opportunity 
              to break free from the cycle of poverty through education. We're not 
              just another charity—we're a movement dedicated to transforming lives 
              and communities across Kenya.
            </p>
            <p className="hero-desc-right">
              Our approach is different. We don't just provide aid; we create 
              sustainable change through strategic partnerships, transparency, 
              and direct impact. Every donation, every story, every girl matters. 
              We measure success not in dollars, but in transformed futures.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section">
        <div className="container">
          <div className="founder-layout">
            <div className="founder-image-main">
              <img src="/founder-main.jpg" alt="Founder" />
            </div>
            <div className="founder-content">
              <h2 className="founder-title">
                FROM<br />
                THE<br />
                FOUNDER
              </h2>
              <p className="founder-text">
                "Growing up in Kenya, I witnessed firsthand how education transforms 
                not just individual lives, but entire communities. Too many bright, 
                capable girls are denied their potential simply because of their 
                circumstances. Tuinue Wasichana was born from a simple belief: 
                every girl deserves a chance to write her own story."
              </p>
              <div className="founder-signature">
                <p className="founder-name">Sarah Njeri</p>
                <p className="founder-role">Founder & Executive Director</p>
              </div>
            </div>
            <div className="founder-image-small">
              <img src="/founder-small.jpg" alt="Founder portrait" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-layout">
            <div className="testimonial-quote">
              <p className="quote-text">
                "Her gorgeous editorial style, extensive expertise, strong sense of 
                brand, and sheer work ethic has <em>elevated everything she touches.</em>"
              </p>
              <p className="quote-attribution">— JANE DOE, FORBES 2023</p>
            </div>
            <div className="testimonial-images">
              <div className="testimonial-img testimonial-img-1">
                <img src="/impact-1.jpg" alt="Impact story" />
              </div>
              <div className="testimonial-img testimonial-img-2">
                <img src="/impact-2.jpg" alt="Impact story" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <h2 className="mission-title">
            <em>Beyond</em><br />
            THE BRAND:
          </h2>
          <p className="mission-subtitle">
            We've created more than a charity—we've cultivated 
            the world's most sustainable empowerment model 
            for girls, changing lives in a class of its own.
          </p>
          <div className="mission-description">
            <p>
              Our work goes far beyond simple donations. We build ecosystems of support, 
              connecting girls with mentors, resources, and opportunities that last a lifetime. 
              Through strategic partnerships with local schools, communities, and businesses, 
              we create pathways to success that are sustainable and scalable.
            </p>
            <p>
              Every program we launch is designed with one goal: lasting transformation. 
              We measure our impact not just in the number of girls helped today, but in 
              the generations of families lifted out of poverty tomorrow.
            </p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-image">
                <img src="/value-education.jpg" alt="Education" />
              </div>
              <h3>We put EDUCATION</h3>
              <p>
                At the heart of everything we do. Quality education isn't a privilege—
                it's a fundamental right. We ensure every girl has access to excellent 
                schools, supplies, and support.
              </p>
            </div>

            <div className="value-card">
              <div className="value-image">
                <img src="/value-transparency.jpg" alt="Transparency" />
              </div>
              <h3>We put TRANSPARENCY</h3>
              <p>
                Above all else. Every donor deserves to know exactly where their money 
                goes and the impact it creates. We provide detailed reports and real 
                stories of transformation.
              </p>
            </div>

            <div className="value-card">
              <div className="value-image">
                <img src="/value-community.jpg" alt="Community" />
              </div>
              <h3>We put COMMUNITY</h3>
              <p>
                At the center of our mission. Real change happens when communities come 
                together. We empower local leaders and create networks of support that 
                last generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
