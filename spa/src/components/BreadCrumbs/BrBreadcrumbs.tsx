import React from 'react';
import './BrBreadcrumbs.css';

interface BreadcrumbItem {
  label: string;
  url?: string;
  active?: boolean;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  homeIcon?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = '',
  homeIcon = true
}) => {


  const handleItemClick = (item: BreadcrumbItem, event: React.MouseEvent) => {
    if (item.onClick) {
      event.preventDefault();
      item.onClick();
    }
  };



  return (
    <div className={`br-breadcrumb ${className}`}>
      <nav aria-label="Navegação estrutural">
        <ul className="crumb-list">
          {homeIcon && items.length > 0 && (
            <li className="crumb home">
              {items[0].url ? (
                <a 
                  className="br-item" 
                  href={items[0].url}
                  onClick={(e) => handleItemClick(items[0], e)}
                  aria-label={items[0].label || "Página inicial"}
                >
                  <i className="fas fa-home" aria-hidden="true"></i>
                </a>
              ) : (
                <span className="br-item">
                  <i className="fas fa-home" aria-hidden="true"></i>
                </span>
              )}
              {items.length > 1 && <i className="icon fas fa-chevron-right" aria-hidden="true"></i>}
            </li>
          )}

          {items.slice(homeIcon ? 1 : 0).map((item, index) => {
            const isLast = index === items.length - (homeIcon ? 1 : 0) - 1;
            const isActive = item.active || isLast;
            
            return (
              <li 
                key={index} 
                className={`crumb ${isActive ? 'active' : ''}`}
                {...(isActive && { 'data-active': 'active' })}
              >
                {item.url && !isActive ? (
                  <a 
                    className="br-item" 
                    href={item.url}
                    onClick={(e) => handleItemClick(item, e)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="br-item">{item.label}</span>
                )}
                {!isLast && <i className="icon fas fa-chevron-right" aria-hidden="true"></i>}
              </li>
            );
          })}

        </ul>
      </nav>
    </div>
  );
};

export default Breadcrumb