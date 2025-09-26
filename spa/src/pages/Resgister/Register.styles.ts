import type { PageStyles } from './Register.types';

export const pageStyles: PageStyles = {
  title: { 
    marginLeft: '70px', 
    marginBottom: '25px', 
    fontSize: '60px' 
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