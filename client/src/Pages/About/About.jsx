import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './About.css';

const About = () => {
  return (
    <>
      <Navbar />
      
      <section className="about-hero-editorial">
        <div className="container">
          <p className="hero-label">Our Story</p>
          <h1 className="hero-title-main">
            Every girl deserves<br />
            <em>a chance to shine.</em>
          </h1>
          <div className="hero-description-grid">
            <p className="hero-desc-left">
              In the heart of Kenya, thousands of girls are forced to drop out of school 
              each year—not because they lack talent or ambition, but because poverty 
              leaves them no choice. Tuinue Wasichana exists to change that.
            </p>
            <p className="hero-desc-right">
              We believe education is the most powerful force for breaking the cycle of 
              poverty. When you educate a girl, you don't just change her life—you 
              transform her family, her community, and generations to come.
            </p>
          </div>
        </div>
      </section>

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
                HEART
              </h2>
              <p className="founder-text">
                "I grew up in a small village in Kenya where I watched brilliant girls 
                disappear from classrooms year after year—not because they weren't smart 
                enough, but because the world had decided they weren't worth investing in. 
                I started Tuinue Wasichana because I refused to accept that. Every girl 
                I've met has a dream. Our job is to make sure poverty doesn't steal it."
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

      <section className="testimonial-section">
        <div className="container">
          <div className="testimonial-layout">
            <div className="testimonial-quote">
              <p className="quote-text">
                "What Tuinue Wasichana does isn't charity—it's <em>justice.</em> 
                They don't just give girls an education; they give them a voice, 
                a future, and the courage to dream beyond what poverty tells them 
                they can be."
              </p>
              <p className="quote-attribution">— Grace A., Teacher, Nakuru County</p>
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

      <section className="mission-section">
        <div className="container">
          <h2 className="mission-title">
            <em>Our</em> Mission
          </h2>
          <p className="mission-subtitle">
            To ensure every girl in Kenya has access to quality education, 
            mentorship, and the support she needs to build her own future.
          </p>
          <div className="mission-description">
            <p>
              We partner with local schools and communities to identify the girls most 
              at risk of dropping out—those orphaned, living in extreme poverty, or 
              facing early marriage. Through sponsorships, school supplies, and 
              mentorship programs, we keep them in class and on track.
            </p>
            <p>
              Our approach goes beyond tuition. We provide sanitary pads so girls 
              don't miss school during their periods. We offer counseling and 
              life-skills training. We work with families to change mindsets about 
              girls' education. We stay with each girl from enrollment through 
              graduation and beyond.
            </p>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-image">
                <img src="/value-education.jpg" alt="Education" />
              </div>
              <h3>Education First</h3>
              <p>
                A girl with an education marries later, earns more, raises healthier 
                children, and lifts her entire community out of poverty. It's the 
                single most powerful investment we can make.
              </p>
            </div>

            <div className="value-card">
              <div className="value-image">
                <img src="/value-transparency.jpg" alt="Transparency" />
              </div>
              <h3>Full Transparency</h3>
              <p>
                Every shilling you give goes directly to a girl in need. We track 
                every expense, share real stories, and send you updates on the 
                lives your generosity is transforming.
              </p>
            </div>

            <div className="value-card">
              <div className="value-image">
                <img src="/value-community.jpg" alt="Community" />
              </div>
              <h3>Community Rooted</h3>
              <p>
                We don't impose solutions from outside. We work hand-in-hand with 
                Kenyan families, schools, and local leaders to create change that 
                is owned by the community and built to last.
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
