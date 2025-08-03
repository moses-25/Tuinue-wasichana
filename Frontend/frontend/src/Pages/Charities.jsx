import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { charityAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from "../components/Navbar";
import Footer from '../components/Footer';
import './Charities.css';

const Charities = () => {
  const [allCharities, setAllCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch charities from backend
  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching charities from API...');
        const response = await charityAPI.getCharities();
        console.log('Charities API response:', response);
        
        if (response.success && response.charities) {
          // Transform backend charity data to match frontend expectations
          const transformedCharities = response.charities.map(charity => ({
            id: charity.id,
            name: charity.name,
            description: charity.description || 'No description available',
            location: charity.location || 'Unknown',
            category: charity.category || 'General',
            raised: charity.raised || 0,
            donors: charity.donors || 0,
            goal: charity.goal || 10000,
            status: charity.status
          }));
          
          console.log('Transformed charities:', transformedCharities);
          setAllCharities(transformedCharities);
          
          if (transformedCharities.length === 0) {
            toast.info('No approved charities found yet. Check back later!');
          }
        } else {
          console.log('API response not successful or no charities:', response);
          setError('No approved charities available yet');
          setAllCharities([]);
        }
      } catch (err) {
        console.error('Error fetching charities:', err);
        setError('Failed to connect to server');
        setAllCharities([]);
        toast.error('Failed to load charities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

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
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#f56565',
            },
          },
        }}
      />
      
      <main className="charities-page">
        <div className="container">
          <div className="page-divider"></div>

          <section className="browse-section">
            <div className="browse-header">
              <div className="browse-text">
                <h2>Browse Charities</h2>
                <p className="charity-subtitle">Find and support charities working to improve menstrual health and education for girls</p>
              </div>
              <div className="browse-actions">
                <Link to="/apply-charity" className="apply-charity-btn">
                  Apply as a Charity
                </Link>
              </div>
            </div>
            
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
          
          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <p>Loading charities...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-state">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          )}
          
          {/* No Charities State */}
          {!loading && !error && allCharities.length === 0 && (
            <div className="empty-state">
              <h3>No charities available yet</h3>
              <p>Be the first to make a difference! Apply to register your charity and start helping girls in need.</p>
              <Link to="/apply-charity" className="apply-charity-btn">
                Apply as a Charity
              </Link>
            </div>
          )}

          {/* No Filtered Results */}
          {!loading && !error && allCharities.length > 0 && filteredCharities.length === 0 && (
            <div className="empty-state">
              <h3>No charities match your search</h3>
              <p>Try adjusting your filters or search terms to find charities.</p>
              <button onClick={() => setFilters({ search: '', category: 'All Categories', location: 'All Locations' })} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          )}
          
          {/* Charities Grid */}
          {!loading && !error && filteredCharities.length > 0 && (
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
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Charities;