import './WhatMakesUsDistinct.css';

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
              {/* Education First Icon - You'll add your SVG here */}
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 45 L50 30 L80 45 M50 30 L50 70" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M30 50 L30 65 Q50 75 70 65 L70 50" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="50" cy="20" r="5" fill="white"/>
              </svg>
            </div>
            <h3 className="distinct-item-title">Education First</h3>
            <p className="distinct-item-description distinct-item-description-bold">
              A girl with an education marries later, earns more, raises healthier children, and lifts her entire community out of poverty. It's the single most powerful investment we can make to break the cycle of poverty.
            </p>
          </div>

          <div className="distinct-item">
            <div className="distinct-icon">
              {/* Christ-Centered Icon - You'll add your SVG here */}
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 20 L50 80 M30 40 L70 40" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                <rect x="45" y="75" width="10" height="10" fill="white"/>
              </svg>
            </div>
            <h3 className="distinct-item-title">Christ Centered</h3>
            <p className="distinct-item-description distinct-item-description-bold">
              Our faith in Jesus Christ is the foundation of everything we do. We believe transformation happens through God's love, and we bring hope to girls and families by meeting their needs while sharing the life-changing message of the Gospel.
            </p>
          </div>

          <div className="distinct-item">
            <div className="distinct-icon">
              {/* Community Rooted Icon - You'll add your SVG here */}
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="35" r="8" stroke="white" strokeWidth="3" fill="none"/>
                <circle cx="30" cy="50" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
                <circle cx="70" cy="50" r="6" stroke="white" strokeWidth="2.5" fill="none"/>
                <path d="M50 45 L50 60 Q50 75 35 75 L30 58 M50 60 Q50 75 65 75 L70 58" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="50" cy="75" r="10" stroke="white" strokeWidth="2" strokeDasharray="3 2" fill="none"/>
              </svg>
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
