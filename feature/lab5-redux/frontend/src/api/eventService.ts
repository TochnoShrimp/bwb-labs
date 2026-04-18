import axiosInstance from './axios';
//import { Event } from '../types/index';   // импортируем тип из types

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

export const getEvents = (includeDeleted?: boolean) => {
  const params = includeDeleted ? { includeDeleted: 'true' } : {};
  return axiosInstance.get<Event[]>('/events', { params });
};

export const getMyEvents = (userId: number) => {
  return axiosInstance.get<Event[]>(`/users/${userId}/events`);
};

export const getEventById = (id: number) => {
  return axiosInstance.get<Event>(`/events/${id}`);
};

export const createEvent = (data: { title: string; description?: string; date: string }) => {
  return axiosInstance.post<Event>('/events', data);
};

export const updateEvent = (id: number, data: any) => {
  return axiosInstance.put<Event>(`/events/${id}`, data);
};

export const deleteEvent = (id: number) => {
  return axiosInstance.delete(`/events/${id}`);
};

export const participateInEvent = (eventId: number) => {
  return axiosInstance.post(`/events/${eventId}/participate`);
};

export const getEventParticipants = (eventId: number) => {
  return axiosInstance.get(`/events/${eventId}/participants`);
};

export const getUserProfile = () => {
  return axiosInstance.get('/users/profile/me');
};