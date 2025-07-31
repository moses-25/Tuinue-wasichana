import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import './Charities.css';

const Charities = () => {
  // this is mock data
  const allCharities = [
    {
      id: 1,
      name: "Girls Sanitary Health Initiative",
      description: "Providing sanitary products and education to girls in rural Kenya",
      location: "Kenya",
      category: "Health",
      raised: 12500,
      donors: 107,
      goal: 20000
    },
    {
      id: 2,
      name: "Clean Water for Schools",
      description: "Building clean water facilities in girls' schools across Tanzania",
      location: "Tanzania",
      category: "Infrastructure",
      raised: 8700,
      donors: 124,
      goal: 15000
    },
    {
      id: 3,
      name: "Menstrual Education Program",
      description: "Teaching proper menstrual hygiene to adolescent girls in Uganda",
      location: "Uganda",
      category: "Education",
      raised: 5300,
      donors: 96,
      goal: 10000
    },
    {
      id: 4,
      name: "School Pad Initiative",
      description: "Providing reusable sanitary pads to schoolgirls in Rwanda",
      location: "Rwanda",
      category: "Health",
      raised: 9800,
      donors: 142,
      goal: 15000
    },
    {
      id: 5,
      name: "Girls' Hygiene Education",
      description: "Educating girls about menstrual health and hygiene practices",
      location: "Ethiopia",
      category: "Education",
      raised: 6700,
      donors: 88,
      goal: 12000
    },
    {
      id: 6,
      name: "Sanitation Facilities Project",
      description: "Building proper sanitation facilities in girls' schools",
      location: "Malawi",
      category: "Infrastructure",
      raised: 11200,
      donors: 156,
      goal: 20000
    }
  ];

  // this here is for the filters
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    location: 'All Locations'
  });

  // random locations
  const locations = ['All Locations', ...new Set(allCharities.map(charity => charity.location))];
  const categories = ['All Categories', ...new Set(allCharities.map(charity => charity.category))];

  
  const filteredCharities = allCharities.filter(charity => {
    return (
      charity.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.category === 'All Categories' || charity.category === filters.category) &&
      (filters.location === 'All Locations' || charity.location === filters.location)
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Navbar />
      
      <main className="charities-page">
        <div className="container">
          <div className="page-divider"></div>

          <section className="browse-section">
            <h2>Browse Charities</h2>
            <p className="charity-subtitle">Find and support charities working to improve menstrual health and education for girls</p>
            
            <div className="filters">
              <div className="filter-group">
                <label>Search</label>
                <input
                  type="text" 
                  name="search"
                  placeholder="Search charities..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="filter-group">
                <label>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Location</label>
                <select
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <div className="page-divider"></div>
          
          {/* Charities Grid */}
          <div className="charities-grid">
            {filteredCharities.map(charity => (
              <div key={charity.id} className="charity-card">
                <div className="charity-header">
                  <h3>{charity.name}</h3>
                  <p>{charity.description}</p>
                </div>
                
                <div className="charity-stats">
                  <div className="raised-amount">
                    <span>${charity.raised.toLocaleString()} raised</span>
                    <span>At {charity.donors} donors</span>
                  </div>
                  
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${Math.min(100, (charity.raised / charity.goal) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      <span>of ${charity.goal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="charity-footer">
                  <div className="charity-tags">
                    <span className="charity-category">{charity.category}</span>
                    <span className="charity-location">{charity.location}</span>
                  </div>
                  <div className="charity-actions">
                    <Link to={`/charities/${charity.id}`} className="learn-more-button">
                      Learn More
                    </Link>
                    <Link to="/donate" className="donate-button">
                      Donate
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Charities;