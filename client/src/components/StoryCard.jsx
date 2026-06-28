import { useState, useEffect, useMemo } from 'react';
import { FiAward, FiUser, FiSearch, FiFilter } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { storiesAPI } from '../services/api';
import './StoryCard.css';

const fallbackStories = [
  {
    id: 1,
    beneficiary_name: "Amina Hassan",
    role: "Software Engineer at Safaricom",
    content: "Tuinue Wasichana paid my school fees through high school. Today I'm the first female engineer in my family, mentoring 5 girls in STEM.",
    achievement: "First in family to attend university",
    graduation_year: "2018 Graduate",
    image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 2,
    beneficiary_name: "Grace Mwangi",
    role: "Medical Student at UoN",
    content: "The mentorship program helped me believe I could become a doctor. I'm now in my 3rd year of medical school with a full scholarship.",
    achievement: "KCSE A- student",
    graduation_year: "2020 Graduate",
    image_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
  },
  {
    id: 3,
    beneficiary_name: "Lilian Adhiambo",
    role: "Founder, Girls in Tech Kenya",
    content: "The STEM scholarship changed my life. I now run an NGO that has trained over 200 girls in coding and robotics.",
    achievement: "Young Innovator Award 2022",
    graduation_year: "2016 Graduate",
    image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face"
  }
];

const mapStory = (s) => ({
  id: s.id,
  beneficiary_name: s.beneficiary_name || s.title || 'Unknown',
  role: s.role || '',
  content: s.content || '',
  achievement: s.achievement || '',
  graduation_year: s.graduation_year || '',
  image_url: s.image_url || ''
});

const SuccessStories = () => {
  const [stories, setStories] = useState(fallbackStories);
  const [apiAttempted, setApiAttempted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await storiesAPI.getStories();
      const raw = response.stories || response || [];
      if (Array.isArray(raw) && raw.length > 0) {
        setStories(raw.map(mapStory));
      }
    } catch {
      // Fallback data already set, just keep it
    } finally {
      setApiAttempted(true);
    }
  };

  const years = useMemo(() => {
    const y = new Set();
    stories.forEach(s => {
      const match = s.graduation_year?.match(/\d{4}/);
      if (match) y.add(match[0]);
    });
    return ['all', ...Array.from(y).sort()];
  }, [stories]);

  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      const matchesSearch = !searchQuery ||
        story.beneficiary_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.achievement?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesYear = selectedYear === 'all' ||
        story.graduation_year?.includes(selectedYear);

      return matchesSearch && matchesYear;
    });
  }, [stories, searchQuery, selectedYear]);

  return (
    <section className={`stories-section ${visible ? 'fade-in' : ''}`}>
      <div className="section-header">
        <h2>Changed Lives, Brighter Futures</h2>
        <p>Meet the girls who transformed their lives through Tuinue Wasichana</p>
      </div>

      <div className="stories-toolbar">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-wrapper">
          <FiFilter className="filter-icon" />
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="year-select"
          >
            {years.map(year => (
              <option key={year} value={year}>
                {year === 'all' ? 'All Years' : year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredStories.length === 0 ? (
        <div className="empty-state">
          <p>No stories found matching your search.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedYear('all'); }} className="retry-btn">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="story-cards">
            {filteredStories.map((story, index) => (
              <div
                key={story.id}
                className="story-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="story-image">
                  <img
                    src={story.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face'}
                    alt={story.beneficiary_name}
                    loading="lazy"
                  />
                  {story.graduation_year && (
                    <div className="graduation-year">{story.graduation_year}</div>
                  )}
                </div>

                <div className="story-content">
                  <h3>{story.beneficiary_name}</h3>
                  {story.role && (
                    <p className="story-role">
                      <FiUser className="icon" /> {story.role}
                    </p>
                  )}

                  <p className="story-text">&ldquo;{story.content}&rdquo;</p>

                  {story.achievement && (
                    <div className="story-achievement">
                      <FiAward className="icon" />
                      <span>{story.achievement}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="section-footer">
            <Link to="/charity" className="view-all-btn">
              Help make more girls successful &rarr;
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default SuccessStories;
