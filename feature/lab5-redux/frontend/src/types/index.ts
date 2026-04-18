export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Event {
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