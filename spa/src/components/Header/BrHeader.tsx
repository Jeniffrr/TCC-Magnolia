import React from 'react';
import './BrHeader.css';

// Interface para as props do componente
interface BrHeaderProps {
  className?: string;
  logoUrl?: string;
  logoAlt?: string;
  onLoginClick?: () => void;
  showLoginButton?: boolean;
  userIsLoggedIn?: boolean;
  userName?: string;
}

// Componente BrHeader com boas práticas aplicadas
const BrHeader: React.FC<BrHeaderProps> = ({
  className = '',
  logoUrl = '/logo.png',
  logoAlt = 'Magnolia',
  onLoginClick,
  showLoginButton = true,
  userIsLoggedIn = false,
  userName = ''
}) => {
  
  // Handler para o clique no botão de login
  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      // Comportamento padrão se nenhum handler for fornecido
      console.log('Login button clicked');
    }
  };

  return (
    <header 
      className={`br-header ${className}`}
      role="banner"
      aria-label="Cabeçalho principal"
    >
      <div className="container-fluid">
        <div className="header-content">
          
          {/* Seção de logo com link para a página inicial */}
          <div className="logo-section">
            <a href="/" aria-label="Página inicial">
              <img 
                src={logoUrl} 
                alt={logoAlt} 
                className="main-logo"
                onError={(e) => {
                  // Fallback para caso a imagem não carregue
                  const target = e.target as HTMLImageElement;
                  target.src = '/fallback-logo.png';
                  target.alt = 'Logo padrão';
                }}
              />
            </a>
          </div>

          {/* Seção do usuário */}
          <div className="user-section">
            {showLoginButton && (
              <>
                {userIsLoggedIn ? (
                  // Usuário logado - mostrar informações do usuário
                  <div className="user-info" aria-label={`Usuário: ${userName}`}>
                    <span className="user-name" aria-hidden="true">
                      {userName}
                    </span>
                    <div className="user-avatar">
                      <i className="fas fa-user-circle" aria-hidden="true"></i>
                    </div>
                  </div>
                ) : (
                  // Usuário não logado - mostrar botão de login
                  <button 
                    className="login-btn br-button" 
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
      </div>
    </header>
  );
};



export default BrHeader;