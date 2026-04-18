import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEvents, createEvent, updateEvent, deleteEvent, getEventById, getMyEvents, participateInEvent, getEventParticipants } from '../../api/eventService';
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

interface EventsState {
  list: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  participants: any[];
  includeDeleted: boolean;
}

const initialState: EventsState = {
  list: [],
  currentEvent: null,
  loading: false,
  error: null,
  participants: [],
  includeDeleted: false,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (includeDeleted: boolean) => {
    const response = await getEvents(includeDeleted);
    return response.data;
  }
);

export const fetchMyEvents = createAsyncThunk(
  'events/fetchMy',
  async (userId: number) => {
    const response = await getMyEvents(userId);
    return response.data;
  }
);

export const createNewEvent = createAsyncThunk(
  'events/create',
  async (eventData: { title: string; description?: string; date: string }) => {
    const response = await createEvent(eventData);
    return response.data;
  }
);

export const updateExistingEvent = createAsyncThunk(
  'events/update',
  async ({ id, data }: { id: number; data: any }) => {
    const response = await updateEvent(id, data);
    return response.data;
  }
);

export const deleteExistingEvent = createAsyncThunk(
  'events/delete',
  async (id: number) => {
    await deleteEvent(id);
    return id;
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchOne',
  async (id: number) => {
    const response = await getEventById(id);
    return response.data;
  }
);

export const joinEvent = createAsyncThunk(
  'events/join',
  async (eventId: number) => {
    const response = await participateInEvent(eventId);
    return { eventId, message: response.data.message };
  }
);

export const fetchParticipants = createAsyncThunk(
  'events/fetchParticipants',
  async (eventId: number) => {
    const response = await getEventParticipants(eventId);
    return { eventId, participants: response.data };
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setIncludeDeleted: (state, action: any) => {
      state.includeDeleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      })
      .addCase(createNewEvent.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateExistingEvent.fulfilled, (state, action) => {
        const index = state.list.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
        if (state.currentEvent?.id === action.payload.id) state.currentEvent = action.payload;
      })
      .addCase(deleteExistingEvent.fulfilled, (state, action) => {
        state.list = state.list.filter(e => e.id !== action.payload);
        if (state.currentEvent?.id === action.payload) state.currentEvent = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        const event = state.list.find(e => e.id === action.payload.eventId);
        if (event) {
          event.participantsCount = (event.participantsCount || 0) + 1;
        }
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.participants = action.payload.participants;
      });
  },
});

export const { setIncludeDeleted } = eventsSlice.actions;
export default eventsSlice.reducer;