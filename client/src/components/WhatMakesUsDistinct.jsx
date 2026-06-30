import './WhatMakesUsDistinct.css';
import H1 from '../assets/H1.svg';
import H2 from '../assets/H2.svg';
import H3 from '../assets/H3.svg';

const WhatMakesUsDistinct = () => {
  return (
    <section className="what-makes-us-distinct">
      <div className="distinct-container">
        <h2 className="distinct-title">Why We're Different</h2>
        <p className="distinct-subtitle distinct-item-description-bold">
          Tuinue Wasichana is an education-focused, transparency-driven, community-rooted organization that connects compassionate donors with girls in Kenya who deserve a chance to shine.
        </p>
        
        <div className="distinct-divider"></div>

        <div className="distinct-grid">
          <div className="distinct-item">
            <div className="distinct-icon">
              <img src={H1} alt="Education First" />
            </div>
            <h3 className="distinct-item-title">Education First</h3>
            <p className="distinct-item-description distinct-item-description-bold">
              A girl with an education marries later, earns more, raises healthier children, and lifts her entire community out of poverty. It's the single most powerful investment we can make to break the cycle of poverty.
            </p>
          </div>

          <div className="distinct-item">
            <div className="distinct-icon">
              <img src={H2} alt="Christ Centered" />
            </div>
            <h3 className="distinct-item-title">Christ Centered</h3>
            <p className="distinct-item-description distinct-item-description-bold">
              Our faith in Jesus Christ is the foundation of everything we do. We believe transformation happens through God's love, and we bring hope to girls and families by meeting their needs while sharing the life-changing message of the Gospel.
            </p>
          </div>

          <div className="distinct-item">
            <div className="distinct-icon">
              <img src={H3} alt="Community Rooted" />
            </div>
            <h3 className="distinct-item-title">Community Rooted</h3>
            <p className="distinct-item-description distinct-item-description-bold">
              We don't impose solutions from outside. We work hand-in-hand with Kenyan families, schools, and local leaders to create change that is owned by the community and built to last for generations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatMakesUsDistinct;
