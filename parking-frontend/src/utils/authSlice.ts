import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../utils/apiClient';

const API_URL = 'http://localhost:8000';

interface AuthState {
  user: { 
    username: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    car_number?: string;
  } | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  access: localStorage.getItem('access_token'),
  refresh: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login/`, credentials);
      return {
        access: response.data.access,
        refresh: response.data.refresh,
        username: credentials.username
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.detail || 'Ошибка авторизации');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Если нужно инвалидировать токен на сервере, добавьте соответствующий эндпоинт
      await apiClient.post('/users/logout/');
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'Ошибка выхода');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.access = null;
      state.refresh = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.user = { username: action.payload.username };
        state.isAuthenticated = true;
        localStorage.setItem('access_token', action.payload.access);
        localStorage.setItem('refresh_token', action.payload.refresh);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.access = null;
        state.refresh = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      });
  }
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;