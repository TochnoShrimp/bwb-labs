import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchMyEvents } from '../../features/events/eventsSlice';
import { getUserProfile } from '../../api/authService';
import { setCredentials } from '../../features/auth/authSlice';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import EventCard from '../Events/components/EventCard';
import styles from './Profile.module.scss';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const { list: myEvents, loading, error } = useAppSelector((state) => state.events);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchMyEvents(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await getUserProfile();
        dispatch(setCredentials({ token, user: res.data }));
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
      }
    };
    fetchProfile();
  }, [dispatch, token]);

  return (
    <div className={styles.profile}>
      <h2>Мой профиль</h2>
      <div className={styles.info}>
        <p><strong>Имя:</strong> {user?.name || 'Не указано'}</p>
        <p><strong>Email:</strong> {user?.email || 'Не указан'}</p>
      </div>
      <h3>Мои мероприятия</h3>
      {loading && <p>Загрузка...</p>}
      {error && <ErrorMessage message={error} onClose={() => {}} />}
      <div className={styles.eventsGrid}>
        {myEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            currentUserId={user?.id}
            showDeletedInfo={false}
          />
        ))}
        {!loading && myEvents.length === 0 && <p>Вы ещё не создали ни одного мероприятия.</p>}
      </div>
    </div>
  );
};

export default Profile;