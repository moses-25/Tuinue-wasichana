


import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ImpactNote.css';

const ImpactNote = ({ message, ctaText, ctaLink = "/donate" }) => {
  return (
    <div className="impact-note">
      <p><strong>{message}</strong></p>
      <Link to={ctaLink} className="primary-button">
        {ctaText}
      </Link>
    </div>
  );
};

ImpactNote.propTypes = {
  message: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  ctaLink: PropTypes.string
};

export default ImpactNote;