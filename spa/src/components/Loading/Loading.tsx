import React from 'react';
import './Loading.css';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'dots' | 'pulse';
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Carregando...',
  size = 'medium',
  variant = 'spinner'
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'dots':
        return 'fas fa-ellipsis-h';
      case 'pulse':
        return 'fas fa-circle';
      default:
        return 'fas fa-spinner fa-spin';
    }
  };

  return (
    <div className={`loading-container loading-${size}`}>
      <i className={`${getIcon()} loading-icon loading-${variant}`}></i>
      <span className="loading-message">{message}</span>
    </div>
  );
};
export default Loading;