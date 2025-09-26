import React from 'react';
import './BrInputIcon.css';

interface BrInputIconProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: string | React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  status?: 'success' | 'danger' | 'warning' | 'info';
  feedbackText?: string;
  maxLength?: number;
  disabled?: boolean;
  required?: boolean;
}

const BrInputIcon: React.FC<BrInputIconProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  icon,
  size = 'medium',
  status,
  feedbackText,
  maxLength,
  disabled = false,
  required = false
}) => {
  const containerClasses = [
    'br-input',
    size,
    status || '',
    disabled ? 'disabled' : '',
    !icon ? 'no-icon' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <label htmlFor={name}>{label}</label>
      <div className={`input-group ${icon ? 'has-icon' : ''}`}>
        {icon && (
          <span className="input-icon">
            {typeof icon === 'string' ? (
              <i className={icon} aria-hidden="true"></i>
            ) : (
              icon
            )}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          required={required}
        />
      </div>
      {feedbackText && (
  <span className={`feedback ${status || 'danger'}`} role="alert">
    {feedbackText}
  </span>
)}
    </div>
  );
};

export default BrInputIcon;
