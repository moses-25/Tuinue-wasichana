import { useState, useEffect } from 'react';
import '../Pages/Dashboards/CharityDashboard.css';

const CharityFormModal = ({ isOpen, onClose, onSave, charity }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Education',
    goalAmount: '',
    location: '',
    description: '',
    status: 'pending'
  });

  useEffect(() => {
    if (charity) {
      setFormData({
        name: charity.name,
        category: charity.category,
        goalAmount: charity.goalAmount.toString(),
        location: charity.location,
        description: charity.description,
        status: charity.status
      });
    } else {
      setFormData({
        name: '',
        category: 'Education',
        goalAmount: '',
        location: '',
        description: '',
        status: 'pending'
      });
    }
  }, [charity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingCharities = JSON.parse(localStorage.getItem('charities')) || [];
    const newCharity = {
      ...formData,
      id: Date.now(),
      goalAmount: Number(formData.goalAmount)
    };
    localStorage.setItem('charities', JSON.stringify([...existingCharities, newCharity]));
    onSave(newCharity);
  };

  if (!isOpen) return null;

  return (
    <div className="cd-modal-overlay">
      <div className="cd-modal-content">
        <h2>{charity ? 'Edit Charity' : 'Add New Charity'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="cd-form-group">
            <label className="cd-form-label">Charity Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="cd-form-input"
              required
            />
          </div>
          
          <div className="cd-form-group">
            <label className="cd-form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="cd-form-input"
              required
            >
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Environment">Environment</option>
              <option value="Animals">Animals</option>
              <option value="Human Rights">Human Rights</option>
              <option value="Disaster Relief">Disaster Relief</option>
            </select>
          </div>
          
          <div className="cd-form-group">
            <label className="cd-form-label">Goal Amount ($) *</label>
            <input
              type="number"
              name="goalAmount"
              value={formData.goalAmount}
              onChange={handleChange}
              className="cd-form-input"
              required
              min="1"
            />
          </div>
          
          <div className="cd-form-group">
            <label className="cd-form-label">Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="cd-form-input"
              required
            />
          </div>
          
          <div className="cd-form-group">
            <label className="cd-form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="cd-form-input"
              required
              rows="4"
            ></textarea>
          </div>
          
          <div className="cd-modal-actions">
            <button 
              type="button" 
              className="cd-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="cd-submit-btn"
            >
              {charity ? 'Update Charity' : 'Add Charity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharityFormModal;