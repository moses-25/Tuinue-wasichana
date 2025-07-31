import { FiHeart, FiDollarSign, FiBarChart2 } from 'react-icons/fi';

const iconComponents = {
  heart: FiHeart,
  dollar: FiDollarSign,
  'bar-chart': FiBarChart2
};

const SectionHeader = ({ title, icon, action }) => {
  const IconComponent = iconComponents[icon];
  
  return (
    <div className="section-header">
      <h2>
        <IconComponent className="section-icon" /> {title}
      </h2>
      {action}
    </div>
  );
};

export default SectionHeader;