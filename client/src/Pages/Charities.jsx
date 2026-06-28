import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiDroplet, FiUsers, FiAward, FiDollarSign } from 'react-icons/fi';
import child1 from '../assets/child1.svg';
import child4 from '../assets/child4.svg';
import child6 from '../assets/child6.svg';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import './Charities.css';

const CountUp = ({ end, suffix, prefix, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            if (end < 1000) {
              setCount(Math.round(eased * end * 10) / 10);
            } else {
              setCount(Math.floor(eased * end));
            }
            if (progress < 1) requestAnimationFrame(animate);
            else setCount(end);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  const formatNumber = (num) => {
    if (num >= 1000) return num.toLocaleString();
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(1);
  };

  return <span ref={ref}>{prefix}{formatNumber(count)}{suffix}</span>;
};

const stories = [
  {
    id: 1,
    name: "Amina Hassan",
    role: "Software Engineer at Safaricom",
    story: "Tuinue Wasichana paid my school fees through high school. Today I'm the first female engineer in my family, mentoring 5 girls in STEM.",
    achievement: "First in family to attend university",
    year: "2018 Graduate",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Grace Mwangi",
    role: "Medical Student at UoN",
    story: "The mentorship program helped me believe I could become a doctor. I'm now in my 3rd year of medical school with a full scholarship.",
    achievement: "KCSE A- student",
    year: "2020 Graduate",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Lilian Adhiambo",
    role: "Founder, Girls in Tech Kenya",
    story: "The STEM scholarship changed my life. I now run an NGO that has trained over 200 girls in coding and robotics.",
    achievement: "Young Innovator Award 2022",
    year: "2016 Graduate",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face"
  }
];

const recentDonations = [
  { name: "Sarah M.", amount: 50, location: "Nairobi", time: "2 min ago" },
  { name: "John K.", amount: 120, location: "Mombasa", time: "15 min ago" },
  { name: "Emily W.", amount: 75, location: "Kisumu", time: "1 hour ago" },
  { name: "David O.", amount: 200, location: "Nairobi", time: "3 hours ago" },
  { name: "Grace A.", amount: 30, location: "Eldoret", time: "5 hours ago" },
  { name: "Peter N.", amount: 500, location: "Nakuru", time: "8 hours ago" },
  { name: "Faith C.", amount: 100, location: "Machakos", time: "12 hours ago" },
  { name: "James M.", amount: 60, location: "Nairobi", time: "1 day ago" },
];

const impactBreakdown = [
  { label: "School Fees", percent: 45, icon: child4, color: "#8B1874", detail: "Tuition, uniforms, books", items: ["Tuition fees", "School uniforms"] },
  { label: "Sanitary Pads", percent: 25, icon: FiDroplet, color: "#E94B6F", detail: "Monthly hygiene kits", items: ["Sanitary pads", "Hygiene education"] },
  { label: "Mentorship", percent: 15, icon: child6, color: "#D97D3A", detail: "Life skills & career guidance", items: ["Career counseling", "STEM workshops", "Peer mentoring"] },
  { label: "Nutrition", percent: 10, icon: child1, color: "#2D5F3F", detail: "School meal programs", items: ["Food supplies", "Health checkups"] },
  { label: "Community", percent: 5, icon: FiUsers, color: "#1A1F3A", detail: "Family sensitization", items: ["Parent workshops", "Community outreach"] },
];

const calculatorOptions = [
  { amount: 25, items: "1 girl with school supplies for a term", breakdown: { fees: 11, pads: 6, mentorship: 4, nutrition: 3, community: 1 } },
  { amount: 50, items: "2 girls with sanitary pads for a year", breakdown: { fees: 22, pads: 13, mentorship: 8, nutrition: 5, community: 2 } },
  { amount: 100, items: "Full school sponsorship for 1 girl for a term", breakdown: { fees: 45, pads: 25, mentorship: 15, nutrition: 10, community: 5 } },
  { amount: 250, items: "Sponsor 3 girls through a school term", breakdown: { fees: 112, pads: 63, mentorship: 38, nutrition: 25, community: 12 } },
  { amount: 500, items: "Sponsor a girl for an entire school year", breakdown: { fees: 225, pads: 125, mentorship: 75, nutrition: 50, community: 25 } },
];

const Charities = () => {
  const [calcAmount, setCalcAmount] = useState(100);
  const [donationIndex, setDonationIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDonationIndex((prev) => (prev + 1) % recentDonations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentCalc = calculatorOptions.find(o => o.amount === calcAmount) || calculatorOptions[2];

  return (
    <>
      <Navbar />

      <main className="impact-page">
        {/* Hero */}
        <section className="impact-hero">
          <div className="container">
            <h1 className="impact-hero-title">Our <em>Impact</em></h1>
            <p className="impact-hero-sub">
              Every donation creates real, measurable change in the lives of girls across Kenya.
            </p>
          </div>
        </section>



        {/* What Your Money Does */}
        <section className="impact-breakdown-section">
          <div className="container">
            <h2 className="section-title">What Your Money Does</h2>
            <p className="section-sub">Every shilling goes directly to programs that keep girls in school.</p>
            
            <div className="impact-dashboard">
              {/* Main Overview Card */}
              <div className="dashboard-card main-card">
                <div className="card-header">
                  <h3>Program Distribution</h3>
                  <span className="trend-badge positive">100% Direct Impact</span>
                </div>
                <div className="visual-breakdown">
                  <div className="breakdown-bars">
                    {impactBreakdown.map((item) => (
                      <div 
                        key={item.label} 
                        className="bar-segment" 
                        style={{ width: `${item.percent}%`, background: item.color }}
                        title={`${item.label}: ${item.percent}%`}
                      />
                    ))}
                  </div>
                  <div className="breakdown-legend">
                    {impactBreakdown.map((item) => (
                      <div key={item.label} className="legend-item">
                        <div className="legend-top">
                          <span className="legend-dot" style={{ background: item.color }} />
                          <span className="legend-label">{item.label}</span>
                          <span className="legend-percent">{item.percent}%</span>
                        </div>
                        <ul className="legend-items">
                          {item.items.map((i) => (
                            <li key={i}>{i}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="impact-calculator-section">
          <div className="container">
            <h2 className="section-title">Your <em>Impact</em> Calculator</h2>
            <p className="section-sub">Slide to see exactly what your donation provides.</p>
            <div className="calculator-card">
              <div className="calculator-amount">
                <span className="calc-label">Your donation</span>
                <span className="calc-value">${calcAmount}</span>
              </div>
              <input
                type="range"
                min={25}
                max={500}
                step={25}
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="calc-slider"
              />
              <div className="calc-markers">
                <span>$25</span>
                <span>$100</span>
                <span>$250</span>
                <span>$500</span>
              </div>
              <p className="calc-result">{currentCalc.items}</p>
              <div className="calc-mini-breakdown">
                {Object.entries(currentCalc.breakdown).map(([key, val]) => {
                  const item = impactBreakdown.find(b => b.label.toLowerCase().includes(key));
                  return (
                    <div key={key} className="calc-mini-item" style={{ width: `${val}%` }}>
                      <span style={{ background: item?.color || "#8B1874" }} />
                    </div>
                  );
                })}
              </div>
              <div className="calc-mini-labels">
                <span>School fees</span>
                <span>Pads</span>
                <span>Mentorship</span>
                <span>Nutrition</span>
                <span>Community</span>
              </div>
              <Link to="/donate" className="calc-cta">Make This Donation</Link>
            </div>
          </div>
        </section>

        {/* Live Donation Feed */}
        <section className="impact-feed-section">
          <div className="container">
            <h2 className="section-title">Live Donations</h2>
            <p className="section-sub">Real-time impact from people like you.</p>
            <div className="donation-feed">
              <div className="donation-ticker">
                {recentDonations.map((d, i) => (
                  <div key={i} className={`donation-item ${i === donationIndex ? 'active' : ''}`}>
                    <FiDollarSign className="donation-icon" />
                    <span className="donation-name">{d.name}</span>
                    <span className="donation-amount">${d.amount}</span>
                    <span className="donation-location">{d.location}</span>
                    <span className="donation-time">{d.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="impact-stories-section">
          <div className="container">
            <h2 className="section-title">Changed Lives</h2>
            <p className="section-sub">Meet the girls your support has transformed.</p>
            <div className="stories-compact">
              {stories.map((story) => (
                <div key={story.id} className="compact-story-card">
                  <div className="compact-story-image">
                    <img src={story.image} alt={story.name} />
                    <span className="compact-year">{story.year}</span>
                  </div>
                  <div className="compact-story-content">
                    <h3>{story.name}</h3>
                    <p className="compact-role">{story.role}</p>
                    <p className="compact-quote">"{story.story}"</p>
                    <div className="compact-achievement">
                      <FiAward className="compact-award" />
                      <span>{story.achievement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="stories-cta">
              <Link to="/stories" className="impact-link">View All Stories →</Link>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </>
  );
};

export default Charities;