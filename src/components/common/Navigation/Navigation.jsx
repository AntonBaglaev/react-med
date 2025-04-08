import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Navigation.scss';

const Navigation = ({ items, activeTab, onTabChange, vertical = false }) => {
  const handleClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className={`navigation ${vertical ? 'navigation--vertical' : 'navigation--horizontal'}`}>
      <ul className="navigation__list">
        {items.map((item) => (
          <li key={item.id} className="navigation__item">
            <NavLink
              to={item.path}
              className={({ isActive }) => 
                `navigation__link ${isActive || activeTab === item.id ? 'navigation__link--active' : ''}`
              }
              onClick={() => handleClick(item.id)}
            >
              {item.icon && <FontAwesomeIcon icon={item.icon} className="navigation__icon" />}
              <span className="navigation__text">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.object
    })
  ).isRequired,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
  vertical: PropTypes.bool
};

export default Navigation;