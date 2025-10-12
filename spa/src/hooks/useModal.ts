import { useState } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'confirm' | 'alert';
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const useModal = () => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert'
  });

  const showAlert = (title: string, message: string, confirmText = 'OK') => {
    return new Promise<void>((resolve) => {
      setModal({
        isOpen: true,
        title,
        message,
        type: 'alert',
        confirmText,
        onConfirm: () => {
          setModal(prev => ({ ...prev, isOpen: false }));
          resolve();
        }
      });
    });
  };

  const showConfirm = (
    title: string, 
    message: string, 
    confirmText = 'Confirmar', 
    cancelText = 'Cancelar'
  ) => {
    return new Promise<boolean>((resolve) => {
      setModal({
        isOpen: true,
        title,
        message,
        type: 'confirm',
        confirmText,
        cancelText,
        onConfirm: () => {
          setModal(prev => ({ ...prev, isOpen: false }));
          resolve(true);
        }
      });
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
    if (modal.type === 'confirm' && modal.onConfirm) {
      // Para confirm, retorna false quando cancelado
      return false;
    }
  };

  return {
    modal,
    showAlert,
    showConfirm,
    closeModal
  };
};