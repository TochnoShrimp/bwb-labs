import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as apiLogin, register as apiRegister } from '../../api/authService';
import { setToken, setUser, removeToken, removeUser } from '../../utils/localStorage';

interface AuthState {
  user: { id: number; name: string; email: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await apiLogin(credentials);
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }) => {
    const response = await apiRegister(userData);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      removeToken();
      removeUser();
    },
    setCredentials: (state, action: any) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      setToken(action.payload.token);
      setUser(action.payload.user);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        setToken(action.payload.token);
        setUser(action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка входа';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;