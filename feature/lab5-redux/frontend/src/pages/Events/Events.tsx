import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchEvents, setIncludeDeleted } from '../../features/events/eventsSlice';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import EventCard from './components/EventCard';
import styles from './Events.module.scss';

const Events: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error, includeDeleted } = useAppSelector((state) => state.events);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEvents(includeDeleted));
  }, [dispatch, includeDeleted]);

  const handleToggle = () => {
    dispatch(setIncludeDeleted(!includeDeleted));
  };

  return (
    <div className={styles.events}>
      <div className={styles.header}>
        <h2>Мероприятия</h2>
        <div className={styles.controls}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={handleToggle}
            />
            Показать удалённые
          </label>
          <Link to="/events/new" className={styles.createButton}>
            Создать мероприятие
          </Link>
        </div>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <ErrorMessage message={error} onClose={() => {}} />}

      <div className={styles.grid}>
        {list.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            currentUserId={user?.id}
            showDeletedInfo={includeDeleted}
          />
        ))}
        {!loading && list.length === 0 && <p>Нет мероприятий.</p>}
      </div>
    </div>
  );
};

export default Events;