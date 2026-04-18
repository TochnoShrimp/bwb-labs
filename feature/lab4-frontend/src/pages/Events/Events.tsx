import React, { useState, useEffect, useCallback } from 'react';
import { getEvents } from '../../api/eventService';
import type { Event } from '../../api/eventService';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { getErrorMessage } from '../../utils/errorHandler';
import styles from './Events.module.scss';
import EventCard from './components/EventCard';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getEvents(includeDeleted);
      setEvents(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [includeDeleted]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleToggle = () => {
    setIncludeDeleted((prev) => !prev);
  };

  return (
    <div className={styles.events}>
      <div className={styles.header}>
        <h2>Мероприятия</h2>
        <label className={styles.toggle}>
          <input type="checkbox" checked={includeDeleted} onChange={handleToggle} />
          Показать удалённые
        </label>
      </div>

      {loading && <p>Загрузка...</p>}
      {error && <ErrorMessage message={error} onClose={() => setError('')} />}

      <div className={styles.grid}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} showDeletedInfo={includeDeleted} />
        ))}
        {!loading && events.length === 0 && <p>Нет мероприятий.</p>}
      </div>
    </div>
  );
};

export default Events;
