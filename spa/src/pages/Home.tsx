import { useNavigate } from "react-router-dom";
import PublicLayout from "../components/Layout/PublicLayout";
import { BrButton } from "@govbr-ds/react-components";
import Logo from "../assets/images/Logo.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #fef6ff 0%, #f3e5f5 100%)', padding: '80px 20px', marginTop: '-24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div>
            <img src={Logo} alt="Magnolia Logo" style={{ width: '300px', marginBottom: '10px' }} />
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#711E6C', margin: '0 0 16px 0', lineHeight: '1.2' }}>Magnolia</h1>
            <h2 style={{ fontSize: '28px', color: '#5a1856', margin: '0 0 24px 0', fontWeight: '500' }}>Apoio Clínico Simples e Seguro</h2>
            <p style={{ fontSize: '20px', color: '#711E6C', marginBottom: '40px', fontWeight: '500', lineHeight: '1.6' }}>
              Transformando dados em decisões rápidas para quem cuida de vidas.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <BrButton
                onClick={() => navigate('/login')}
                style={{ backgroundColor: '#711E6C', color: 'white', padding: '16px 32px', fontSize: '18px', fontWeight: '600', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(113, 30, 108, 0.3)' }}
              >
                <i className="fas fa-sign-in-alt" style={{ marginRight: '10px' }}></i>
                Acessar Sistema
              </BrButton>
              <BrButton
                onClick={() => navigate('/registrar')}
                style={{ backgroundColor: 'white', color: '#711E6C', padding: '16px 32px', fontSize: '18px', fontWeight: '600', border: '3px solid #711E6C', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(113, 30, 108, 0.2)' }}
              >
                <i className="fas fa-user-plus" style={{ marginRight: '10px' }}></i>
                Primeiro Acesso
              </BrButton>
            </div>
          </div>

        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#711E6C', textAlign: 'center', marginBottom: '60px' }}>Por que escolher o Magnolia?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center', padding: '30px', background: '#fef6ff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(113, 30, 108, 0.1)' }}>
              <i className="fas fa-tachometer-alt" style={{ fontSize: '60px', color: '#711E6C', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#711E6C', marginBottom: '12px' }}>Rápido e Eficiente</h3>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>Acesse informações vitais em segundos. Interface intuitiva que elimina a complexidade.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '30px', background: '#fef6ff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(113, 30, 108, 0.1)' }}>
              <i className="fas fa-shield-alt" style={{ fontSize: '60px', color: '#711E6C', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#711E6C', marginBottom: '12px' }}>Seguro e Confiável</h3>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>Proteção total dos dados com os mais rigorosos padrões de segurança.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '30px', background: '#fef6ff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(113, 30, 108, 0.1)' }}>
              <i className="fas fa-chart-line" style={{ fontSize: '60px', color: '#711E6C', marginBottom: '20px' }}></i>
              <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#711E6C', marginBottom: '12px' }}>Decisões Inteligentes</h3>
              <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6' }}>Classificação de risco automática e métricas que apoiam diagnósticos precisos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div style={{ padding: '80px 20px ', background: 'linear-gradient(135deg, #f3e5f5 0%, #fef6ff 100%)', minHeight: 'calc(100vh - 400px)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: 'white', padding: '50px', borderRadius: '20px', boxShadow: '0 8px 24px rgba(113, 30, 108, 0.15)' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#711E6C', marginBottom: '30px', textAlign: 'center' }}>Desenvolvido para profissionais de saúde</h2>
            <p style={{ fontSize: '18px', color: '#374151', lineHeight: '1.8', marginBottom: '20px' }}>
              Bem-vindo ao <strong style={{ color: '#711E6C' }}>Magnolia</strong>. Sabemos que na rotina clínica, cada segundo conta. Por isso, desenvolvemos uma ferramenta que não apenas armazena informações, mas que trabalha junto com você.
            </p>
            <p style={{ fontSize: '18px', color: '#374151', lineHeight: '1.8', marginBottom: '20px' }}>
              Com uma interface amigável e intuitiva, o Magnolia elimina a complexidade dos sistemas tradicionais, permitindo que médicos e enfermeiros acessem históricos e métricas vitais em instantes. O nosso foco é entregar a informação certa na hora certa, apoiando diagnósticos ágeis e precisos.
            </p>
            <p style={{ fontSize: '18px', color: '#374151', lineHeight: '1.8', marginBottom: '30px' }}>
              Tudo isso construído sobre uma base sólida de segurança. Seus dados e os dos seus pacientes são tratados com os mais rigorosos padrões de proteção, garantindo confidencialidade total.
            </p>
            <p style={{ fontSize: '20px', color: '#711E6C', fontWeight: '600', fontStyle: 'italic', textAlign: 'center', marginTop: '40px', marginBottom: '0' }}>
              A tecnologia cuidando dos detalhes, para você cuidar das pessoas.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
