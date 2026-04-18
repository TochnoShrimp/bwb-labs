import axiosInstance from './axios';

export interface Event {
  id: number;
  title: string;
  description: string | null;
  date: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  User?: {
    id: number;
    name: string;
    email: string;
  };
}

export const getEvents = (includeDeleted?: boolean) => {
  const params = includeDeleted ? { includeDeleted: 'true' } : {};
  return axiosInstance.get<Event[]>('/events', { params });
};

export const createEvent = (data: { title: string; description?: string; date: string }) =>
  axiosInstance.post<Event>('/events', data);
