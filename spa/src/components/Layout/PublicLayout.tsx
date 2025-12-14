import React from 'react';
import { Container } from '@govbr-ds/react-components';
import BrHeader from '../Header/BrHeader';
import Footer from '../Footer/Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showLoginButton?: boolean;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ 
  children, 
  showHeader = true, 
  showLoginButton = true 
}) => {
  const handleLogin = () => {
    window.location.href = '/login';
  };

  return (
    <>
      {showHeader && (
        <BrHeader 
          userIsLoggedIn={false}
          onLoginClick={handleLogin}
          showLoginButton={showLoginButton}
        />
      )}
      <Container fluid >
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default PublicLayout;