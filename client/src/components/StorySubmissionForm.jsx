import { useState } from 'react';
import { FiX, FiSend, FiPlus } from 'react-icons/fi';
import { storiesAPI } from '../services/api';
import './StorySubmissionForm.css';

const StorySubmissionForm = ({ onStoryCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    beneficiary_name: '',
    role: '',
    content: '',
    achievement: '',
    graduation_year: '',
    image_url: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.beneficiary_name.trim() || !formData.content.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const response = await storiesAPI.createStory(formData);
      if (response.success) {
        setFormData({
          beneficiary_name: '',
          role: '',
          content: '',
          achievement: '',
          graduation_year: '',
          image_url: ''
        });
        setIsOpen(false);
        if (onStoryCreated) onStoryCreated(response.story);
      } else {
        setError(response.error || 'Failed to create story');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="add-story-btn" onClick={() => setIsOpen(true)}>
        <FiPlus /> Share a Success Story
      </button>

      {isOpen && (
        <div className="story-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="story-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share a Success Story</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="story-form">
              {error && <p className="form-error">{error}</p>}

              <div className="form-group">
                <label htmlFor="beneficiary_name">Beneficiary Name *</label>
                <input
                  id="beneficiary_name"
                  name="beneficiary_name"
                  value={formData.beneficiary_name}
                  onChange={handleChange}
                  placeholder="e.g. Amina Hassan"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Current Role / Position</label>
                <input
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer at Safaricom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Their Story *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Tell their story of transformation..."
                  rows={5}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="achievement">Key Achievement</label>
                <input
                  id="achievement"
                  name="achievement"
                  value={formData.achievement}
                  onChange={handleChange}
                  placeholder="e.g. First in family to attend university"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="graduation_year">Graduation Year</label>
                  <input
                    id="graduation_year"
                    name="graduation_year"
                    value={formData.graduation_year}
                    onChange={handleChange}
                    placeholder="e.g. 2024 Graduate"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="image_url">Photo URL</label>
                  <input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="submit-story-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : <><FiSend /> Submit Story</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StorySubmissionForm;
