import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { joinEvent, fetchParticipants } from '../../../features/events/eventsSlice';
import type { Event } from '../../../api/eventService';
import ParticipantsModal from '../../../components/ParticipantsModal/ParticipantsModal';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: Event;
  currentUserId?: number;
  showDeletedInfo?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, currentUserId, showDeletedInfo }) => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  const isOwner = event.createdBy === currentUserId;
  const isDeleted = event.deletedAt !== null;

  const handleParticipate = () => {
    dispatch(joinEvent(event.id));
  };

  const handleShowParticipants = () => {
    dispatch(fetchParticipants(event.id));
    setShowModal(true);
  };

  return (
    <>
      <div className={`${styles.card} ${isDeleted ? styles.deleted : ''}`}>
        <h3>{event.title}</h3>
        <p>{event.description || 'Нет описания'}</p>
        <p><strong>Дата:</strong> {formatDate(event.date)}</p>
        <p><strong>Организатор:</strong> {event.User?.name || event.createdBy}</p>
        {showDeletedInfo && isDeleted && (
          <p><strong>Удалено:</strong> {formatDate(event.deletedAt!)}</p>
        )}
        <div className={styles.footer}>
          {!isOwner && !isDeleted && (
            <button onClick={handleParticipate} className={styles.participateBtn}>
              Участвовать
            </button>
          )}
          {isOwner && !isDeleted && (
            <Link to={`/events/${event.id}/edit`} className={styles.editBtn}>
              Редактировать
            </Link>
          )}
          <button onClick={handleShowParticipants} className={styles.participantsBtn}>
            Участники: {event.participantsCount || 0}
          </button>
        </div>
      </div>
      {showModal && (
        <ParticipantsModal eventId={event.id} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default EventCard;