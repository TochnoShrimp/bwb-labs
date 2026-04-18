import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createNewEvent, fetchEvents } from '../../features/events/eventsSlice';
import EventForm from '../../components/EventForm/EventForm';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, includeDeleted } = useAppSelector((state) => state.events);

  const handleSubmit = async (data: { title: string; description?: string; date: string }) => {
    try {
      await dispatch(createNewEvent(data)).unwrap();
      // Обновляем список мероприятий, чтобы новое появилось
      await dispatch(fetchEvents(includeDeleted));
      navigate('/events');
    } catch (error) {
      console.error('Ошибка создания:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Создание мероприятия</h2>
      <EventForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreateEvent;