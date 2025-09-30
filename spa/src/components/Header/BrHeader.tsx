import React, { useState } from 'react';
import './BrHeader.css';
import logo from '../../assets/images/Logo.png';

// Interface para os links de navegação
interface NavLink {
  label: string;
  href: string;
  icon?: string;
}

// Interface para as props do componente
interface BrHeaderProps {
  className?: string;
  logoUrl?: string;
  logoAlt?: string;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  showLoginButton?: boolean;
  userIsLoggedIn?: boolean;
  userName?: string;
  navLinks?: NavLink[];
}

// Componente BrHeader refatorado
const BrHeader: React.FC<BrHeaderProps> = ({
  className = '',
  logoUrl = logo,
  logoAlt = 'Magnolia',
  onLoginClick,
  onLogoutClick,
  showLoginButton = true,
  userIsLoggedIn = false,
  navLinks = []
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Handler para o clique no botão de login
  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      window.location.href = '/login';
    }
  };

  // Handler para logout
  const handleLogoutClick = () => {
    if (onLogoutClick) {
      onLogoutClick();
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_name');
      window.location.href = '/login';
    }
    setDropdownOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header 
      className={`br-header ${className}`}
      role="banner"
      aria-label="Cabeçalho principal"
    >
      <div className="header-wrapper">
        {/* Logo no início */}
        <div className="logo-section">
          <a href="/" aria-label="Página inicial">
            <img 
              src={logoUrl} 
              alt={logoAlt} 
              className="main-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/fallback-logo.png';
                target.alt = 'Logo padrão';
              }}
            />
          </a>
        </div>

        {/* Links de navegação no meio (opcional) */}
        {navLinks.length > 0 && (
          <nav className="nav-section">
            <ul className="nav-links">
              {navLinks.map((link, index) => (
                <li key={index} className="nav-item">
                  <a href={link.href} className="nav-link">
                    {link.icon && <i className={link.icon} aria-hidden="true"></i>}
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Usuário/Login no final */}
        <div className="user-section">
          {showLoginButton && (
            <>
              {userIsLoggedIn ? (
                // Usuário logado - avatar com dropdown
                <div className="user-dropdown">
                  <button 
                    className="user-avatar-btn"
                    onClick={toggleDropdown}
                    aria-label={`Menu do usuário`}
                  >
                    <div className="user-avatar">
                      <i className="fas fa-user-circle" aria-hidden="true"></i>
                    </div>
                    <i className={`fas fa-chevron-down dropdown-arrow ${dropdownOpen ? 'open' : ''}`}></i>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <button 
                        className="dropdown-item logout-btn"
                        onClick={handleLogoutClick}
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Sair</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Usuário não logado - botão de login
                <button 
                  className="login-btn" 
                  type="button"
                  onClick={handleLoginClick}
                  aria-label="Fazer login"
                >
                  <i className="fas fa-user" aria-hidden="true"></i>
                  <span>Entrar</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};



export default BrHeader;