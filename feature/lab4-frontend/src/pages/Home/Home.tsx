import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../../utils/localStorage';
import Button from '../../components/Button/Button';
import styles from './Home.module.scss';

const Home: React.FC = () => {
  const user = getUser();

  return (
    <div className={styles.home}>
      <h1>Добро пожаловать в EventApp!</h1>
      <p>Приложение для управления мероприятиями.</p>
      {!user ? (
        <div className={styles.buttons}>
          <Link to="/login">
            <Button>Войти</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Регистрация</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.buttons}>
          <Link to="/events">
            <Button>Мероприятия</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
