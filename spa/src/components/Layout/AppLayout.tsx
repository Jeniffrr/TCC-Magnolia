import React from 'react';
import { Container } from '@govbr-ds/react-components';
import BrHeader from '../Header/BrHeader';
import { useAuth } from '../../hooks/useAuth';
import Footer from '../Footer/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showLoginButton?: boolean;
  navLinks?: Array<{ label: string; href: string; icon?: string }>;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  showHeader = true, 
  showLoginButton = true,
  navLinks = []
}) => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Links de navegação baseados no tipo de usuário
  const getNavLinks = () => {
    const defaultLinks = navLinks;
    
    if (isAuthenticated && user?.tipo_usuario === 'administrador') {
      return [
        ...defaultLinks,
        { label: 'Pagina Incial', href: '/admin' },
        { label: 'Gerenciar Usuários', href: '/admin/usuarios' },
        { label: 'Gerenciar Leitos', href: '/admin/leitos' }
      ];
    }
    
    if (isAuthenticated && user?.tipo_usuario !== 'administrador') {
      return [
        ...defaultLinks,
        { label: 'Pagina Inicial', href: '/profissionais' },
        { label: 'Gerenciar Pacientes', href: '/profissionais/pacientes' },
      ];
    }
    
    return defaultLinks;
  };

  return (
    <>
      {showHeader && (
        <BrHeader 
          userIsLoggedIn={isAuthenticated}
          userName={user?.nome}
          onLoginClick={handleLogin}
          onLogoutClick={handleLogout}
          showLoginButton={showLoginButton}
          navLinks={getNavLinks()}
        />
      )}
      <Container fluid style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default AppLayout;