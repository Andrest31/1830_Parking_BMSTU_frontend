import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../utils/apiClient';

const API_URL = 'http://localhost:8000/api';

interface AuthState {
  user: { username: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  email?: string;
  first_name?: string;
  last_name?: string;
  car_number?: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/login/`, credentials);
      return {
        token: response.data.token,
        username: credentials.username
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'Ошибка авторизации');
      }
      return rejectWithValue('Неизвестная ошибка');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
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
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
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
        state.token = action.payload.token;
        state.user = { username: action.payload.username };
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      });
  }
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export default authSlice.reducer;