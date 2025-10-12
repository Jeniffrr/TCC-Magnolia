import React from 'react';
import { BrButton } from '@govbr-ds/react-components';
import { pageStyles } from '../../assets/style/pageStyles';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'confirm' | 'alert';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  type = 'alert',
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          {type === 'confirm' && (
            <BrButton
              onClick={onCancel}
              style={pageStyles.secundaryButton}
              className="modal-button cancel-button"
            >
              {cancelText}
            </BrButton>
          )}
          <BrButton
            onClick={onConfirm}
            style={pageStyles.primaryButton}
            className="modal-button confirm-button"
          >
            {confirmText}
          </BrButton>
        </div>
      </div>
    </div>
  );
};

export default Modal;