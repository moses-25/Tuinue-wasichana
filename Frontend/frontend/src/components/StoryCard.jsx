import { useState, useEffect } from 'react';
import { FiAward, FiBook, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { storiesAPI } from '../services/api';
import './StoryCard.css';

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  // Default stories as fallback
  const defaultStories = [
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

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await storiesAPI.getStories();
        if (response.success && response.stories && response.stories.length > 0) {
          // Transform backend stories to match component format
          const transformedStories = response.stories.map(story => ({
            id: story.id,
            name: story.title || "Success Story",
            role: "Community Member",
            story: story.content,
            achievement: "Supported by Tuinue Wasichana",
            year: new Date(story.created_at).getFullYear() + " Story",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
          }));
          setStories(transformedStories);
          setUsingFallback(false);
        } else {
          setStories(defaultStories);
          setUsingFallback(true);
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
        setStories(defaultStories);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <section className="stories-section">
      <div className="section-header">
        <h2>Changed Lives, Brighter Futures</h2>
        <p>Meet the girls who transformed their lives through Tuinue Wasichana</p>
        {usingFallback && (
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#666', 
            fontStyle: 'italic',
            marginTop: '0.5rem'
          }}>
            Showing sample stories (server temporarily unavailable)
          </div>
        )}
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