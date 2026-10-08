import { useEffect } from 'react';

export default function Modal({ 
  isOpen, 
  type = 'confirm', // 'confirm' | 'alert'
  title, 
  message, 
  onConfirm, 
  onCancel,
  variant = 'danger' // 'danger' | 'info' | 'success'
}) {
  // Закрытие по клавише Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  // Блокировка скролла при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  // Иконки в зависимости от типа и варианта
  const getIcon = () => {
    if (type === 'alert') {
      if (variant === 'success') return '✅';
      if (variant === 'info') return 'ℹ️';
      return '❌';
    }
    return '️';
  };

  // Текст кнопки подтверждения
  const getConfirmText = () => {
    if (type === 'alert') return 'ОК';
    return 'Удалить';
  };

  // Обработчик кнопки подтверждения
  const handleConfirm = () => {
    if (type === 'alert') {
      onCancel(); // Для alert просто закрываем
    } else if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal-content modal-${variant}`}>
        <button className="modal-close" onClick={onCancel} aria-label="Закрыть">
          ✕
        </button>
        
        <div className="modal-icon">
          {getIcon()}
        </div>
        
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        
        <div className={`modal-actions ${type === 'alert' ? 'modal-actions-single' : ''}`}>
          {type === 'confirm' && (
            <button 
              className="btn btn-secondary" 
              onClick={onCancel}
            >
              Отмена
            </button>
          )}
          <button 
            className={`btn ${type === 'alert' 
              ? (variant === 'danger' ? 'btn-danger' : 'btn-primary') 
              : 'btn-danger'
            }`}
            onClick={handleConfirm}
          >
            {getConfirmText()}
          </button>
        </div>
      </div>
    </div>
  );
}