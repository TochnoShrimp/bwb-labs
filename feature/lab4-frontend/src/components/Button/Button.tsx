import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        { [styles.fullWidth]: fullWidth },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
