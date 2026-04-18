import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchParticipants } from '../../features/events/eventsSlice';
import styles from './ParticipantsModal.module.scss';

interface ParticipantsModalProps {
  eventId: number;
  onClose: () => void;
}

const ParticipantsModal: React.FC<ParticipantsModalProps> = ({ eventId, onClose }) => {
  const dispatch = useAppDispatch();
  const participants = useAppSelector((state) => state.events.participants);
  const loading = useAppSelector((state) => state.events.loading); // можно отдельный флаг

  React.useEffect(() => {
    if (eventId) {
      dispatch(fetchParticipants(eventId));
    }
  }, [dispatch, eventId]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>Участники мероприятия</h3>
        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <ul>
            {participants.map((p: any) => (
              <li key={p.id}>{p.name} ({p.email})</li>
            ))}
          </ul>
        )}
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default ParticipantsModal;