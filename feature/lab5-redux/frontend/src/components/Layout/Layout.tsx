import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, clearAuth } from '../../utils/localStorage';
import Button from '../Button/Button';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // await logout(); // опционально
    } catch (_error) {
      // игнорируем
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">EventApp</Link>
        </div>
        <nav className={styles.nav}>
          {user ? (
            <>
              <span className={styles.user}>Привет, {user.name}</span>
              <Link to="/profile" className={styles.link}>Профиль</Link>
              <Button variant="secondary" onClick={handleLogout}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>
                Войти
              </Link>
              <Link to="/register" className={styles.link}>
                Регистрация
              </Link>
            </>
          )}
          <Link to="/events" className={styles.link}>
            Мероприятия
          </Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default Layout;