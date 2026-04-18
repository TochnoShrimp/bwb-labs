import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchEventById, updateExistingEvent, fetchEvents } from '../../features/events/eventsSlice';
import EventForm from '../../components/EventForm/EventForm';
//import { Event } from '../../types';

interface Event {
  id: number;
  title: string;
  description: string | null;
  date: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  participantsCount?: number;
  User?: {
    id: number;
    name: string;
    email: string;
  };
}

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentEvent, loading, includeDeleted } = useAppSelector((state) => state.events);
  const [initialData, setInitialData] = useState<{ title: string; description?: string; date: string } | undefined>();

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentEvent) {
      setInitialData({
        title: currentEvent.title,
        description: currentEvent.description || '',
        date: new Date(currentEvent.date).toISOString().slice(0, 16),
      });
    }
  }, [currentEvent]);

  const handleSubmit = async (data: { title: string; description?: string; date: string }) => {
    if (!id) return;
    await dispatch(updateExistingEvent({ id: parseInt(id), data })).unwrap();
    await dispatch(fetchEvents(includeDeleted));
    navigate('/events');
  };

  if (loading && !initialData) return <p>Загрузка...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Редактирование мероприятия</h2>
      {initialData ? (
        <EventForm initialData={initialData} onSubmit={handleSubmit} loading={loading} />
      ) : (
        <p>Мероприятие не найдено</p>
      )}
    </div>
  );
};

export default EditEvent;