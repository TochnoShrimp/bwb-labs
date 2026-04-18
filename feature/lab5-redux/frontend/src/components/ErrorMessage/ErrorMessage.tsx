import React from 'react';
import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className={styles.error}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className={styles.close}>
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
