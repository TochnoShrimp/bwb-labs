import React from 'react';
import type { Event } from '../../../api/eventService';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: Event;
  showDeletedInfo?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, showDeletedInfo }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const isDeleted = event.deletedAt !== null;

  return (
    <div className={`${styles.card} ${isDeleted ? styles.deleted : ''}`}>
      <h3>{event.title}</h3>
      <p>{event.description || 'Нет описания'}</p>
      <p>
        <strong>Дата:</strong> {formatDate(event.date)}
      </p>
      <p>
        <strong>Организатор:</strong> {event.User?.name || event.createdBy}
      </p>
      {showDeletedInfo && isDeleted && (
        <p>
          <strong>Удалено:</strong> {formatDate(event.deletedAt!)}
        </p>
      )}
    </div>
  );
};

export default EventCard;
