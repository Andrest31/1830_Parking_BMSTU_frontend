// store/ordersSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import apiClient from '../utils/apiClient';

// types.ts
export interface Parking {
  id: number;
  name: string;
  short_name: string;
}

export interface ParkingItem {
  id: number;
  parking: Parking;
  short_name: string;
  quantity: number;
}

export interface Order {
  id: number;
  created_at: string;
  submitted_at?: string;
  deadline: string;
  car_number: string;
  full_name: string;
  total_quantity: number;
  status: string;
  items: ParkingItem[];  // Теперь используем items вместо parkings
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/orders/'); // Используем наш apiClient
      return response.data.orders;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Можно добавить автоматический logout здесь
          return rejectWithValue("Требуется авторизация");
        }
        return rejectWithValue(error.response?.data?.error || "Ошибка загрузки заявок");
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default ordersSlice.reducer;