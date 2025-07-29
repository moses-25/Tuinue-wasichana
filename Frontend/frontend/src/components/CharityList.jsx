import { FiPlus } from 'react-icons/fi';
import '../Pages/Dashboards/CharityDashboard.css';

const CharityList = ({ charities, onAddCharity, onEditCharity, onDeleteCharity }) => {
  return (
    <div>
      <div className="cd-section-header">
        <h2 className="cd-section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          My Charities
        </h2>
        <button className="cd-add-button" onClick={onAddCharity}>
          <FiPlus className="cd-add-icon" />
          Add Charity
        </button>
      </div>
    </div>
  );
};

export default CharityList;