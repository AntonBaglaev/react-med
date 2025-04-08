import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Input.scss';

const Input = ({
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`input-container ${className}`}>
      {icon && (
        <div className="input-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`input-field ${icon ? 'with-icon' : ''}`}
        {...props}
      />
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.object,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;