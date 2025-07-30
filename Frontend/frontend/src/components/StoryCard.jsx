import { FiAward, FiBook, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './StoryCard.css';
import AminaImg from '../assets/images/Amina.jpg'; 
import GraceImg from '../assets/images/Grace.jpg';
import AdhiImg from '../assets/images/Adhi.jpg';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Amina Hassan",
      role: "Software Engineer at Safaricom",
      story: "Tuinue Wasichana paid my school fees through high school. Today I'm the first female engineer in my family, mentoring 5 girls in STEM.",
      achievement: "First in family to attend university",
      year: "2018 Graduate",
      image: AminaImg // will find a better picture when i do
    },
    {
      id: 2,
      name: "Grace Mwangi",
      role: "Medical Student at UoN",
      story: "The mentorship program helped me believe I could become a doctor. I'm now in my 3rd year of medical school with a full scholarship.",
      achievement: "KCSE A- student",
      year: "2020 Graduate",
      image: GraceImg // will find something better as whell or interchangeable!
    },
    {
      id: 3,
      name: "Lilian Adhiambo",
      role: "Founder, Girls in Tech Kenya",
      story: "The STEM scholarship changed my life. I now run an NGO that has trained over 200 girls in coding and robotics.",
      achievement: "Young Innovator Award 2022",
      year: "2016 Graduate",
      image: AdhiImg // interchangeable as well
    }
  ];

  return (
    <section className="stories-section">
      <div className="section-header">
        <h2>Changed Lives, Brighter Futures</h2>
        <p>Meet the girls who transformed their lives through Tuinue Wasichana</p>
      </div>

      <div className="story-cards">
        {stories.map((story) => (
          <div key={story.id} className="story-card">
            <div className="story-image">
              <img src={story.image} alt={story.name} />
              <div className="graduation-year">{story.year}</div>
            </div>
            
            <div className="story-content">
              <h3>{story.name}</h3>
              <p className="story-role">
                <FiUser className="icon" /> {story.role}
              </p>
              
              <p className="story-text">"{story.story}"</p>
              
              <div className="story-achievement">
                <FiAward className="icon" />
                <span>{story.achievement}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="section-footer">
        <Link to="/charity" className="view-all-btn">
          Help make more girls successful  →→
        </Link>
      </div>
    </section>
  );
};

export default SuccessStories;