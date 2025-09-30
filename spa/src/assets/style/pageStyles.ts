import React from 'react';

// Interface para os estilos da página
interface PageStyles {
  title: React.CSSProperties;
  sectionTitle: React.CSSProperties;
  userSectionTitle: React.CSSProperties;
  buttonContainer: React.CSSProperties;
  primaryButton: React.CSSProperties;
  secundaryButton: React.CSSProperties;
  containerPadding: React.CSSProperties;
}

export const pageStyles: PageStyles = {
  title: { 
    fontWeight: '300',
    marginLeft: '70px', 
    marginBottom: '25px', 
    fontSize: '50px' 
  },
  sectionTitle: { 
    marginBottom: '20px', 
    color: '#333' 
  },
  userSectionTitle: { 
    marginTop: '30px', 
    marginBottom: '20px', 
    color: '#333' 
  },
  buttonContainer: { 
    marginTop: '30px', 
    display: 'flex', 
    gap: '16px', 
    justifyContent: 'flex-end' 
  },
  primaryButton: {
    background: '#711E6C',
    border: 'none',
    borderRadius: '20px',
    padding: '12px 30px',
    fontSize: '16px',
    color: '#fff',
    textAlign: 'center',
    outline: 'none',
    marginBottom: '20px',
  },
  secundaryButton: {
    background: 'transparent' ,
    border: '1px solid #711E6C ',
    color: '#711E6C ',
    borderRadius: '20px ',
    padding: '12px 30px ',
    minWidth: '150px ',
    fontSize: '16px ',
    transition: 'all 0.3s ',
    cursor: 'pointer',
    textAlign: 'center',
    marginBottom: '20px ',
  },
  containerPadding: { 
    padding: '0 40px',
    maxWidth: '1100px',
    margin: '0 auto'
  }
};

export const getFieldStatus = (error: string | undefined) => 
  error ? "danger" : undefined;

export const getFeedbackText = (error: string | undefined, defaultText?: string) => 
  error || defaultText;