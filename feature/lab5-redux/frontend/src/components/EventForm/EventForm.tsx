import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button/Button';
import styles from './EventForm.module.scss';

interface EventFormData {
  title: string;
  description?: string;
  date: string;
}

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  loading: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ initialData, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    defaultValues: initialData || { title: '', description: '', date: '' },
  });

  const validateDate = (value: string) => {
    const selected = new Date(value);
    const now = new Date();
    return selected >= now || 'Дата не может быть раньше текущей';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label>Название *</label>
        <input
          {...register('title', { required: 'Название обязательно', minLength: { value: 3, message: 'Минимум 3 символа' } })}
          className={styles.input}
        />
        {errors.title && <span className={styles.error}>{errors.title.message}</span>}
      </div>
      <div className={styles.field}>
        <label>Описание</label>
        <textarea {...register('description')} rows={4} className={styles.textarea} />
      </div>
      <div className={styles.field}>
        <label>Дата и время *</label>
        <input
          type="datetime-local"
          {...register('date', { required: 'Дата обязательна', validate: validateDate })}
          className={styles.input}
        />
        {errors.date && <span className={styles.error}>{errors.date.message}</span>}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Сохранение...' : initialData ? 'Обновить' : 'Создать'}
      </Button>
    </form>
  );
};

export default EventForm;