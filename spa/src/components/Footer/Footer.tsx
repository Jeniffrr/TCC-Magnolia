import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="magnolia-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Magnolia</h3>
          <p className="footer-description">Apoio Clínico Simples e Seguro</p>
        </div>
        
        <div className="footer-section">
          <h4>Contato</h4>
          <p><i className="fas fa-envelope"></i> contato@magnolia.com.br</p>
          <p><i className="fas fa-phone"></i> (11) 0000-0000</p>
        </div>
        
        <div className="footer-section">
          <h4>Links Úteis</h4>
          <a href="/">Sobre o Sistema</a>
          <a href="/privacidade">Política de Privacidade</a>
          <a href="/termos">Termos de Uso</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Magnolia. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
