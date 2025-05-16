import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

interface OrderItem {
  id: number;
  parking: {
    id: number;
    name: string;
    short_name: string;
  };
  quantity: number;
}

interface Order {
  id: number;
  created_at: string;
  deadline: string | null;
  full_name: string;
  car_number: string;
  status: string;
  items: OrderItem[];
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

export const fetchUserOrders = createAsyncThunk<Order[], void, { state: RootState }>(
  'orders/fetchUserOrders',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.access) {
      return rejectWithValue('No authentication token');
    }

    try {
      const response = await fetch('/api/orders/', {
        headers: {
          'Authorization': `Bearer ${auth.access}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message || 'Request failed');
      }

      const data = await response.json();
      return data.orders;
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
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