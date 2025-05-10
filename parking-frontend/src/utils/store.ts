import { configureStore, ThunkAction, AnyAction  } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ordersReducer from "./ordersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false, // Отключаем проверку для thunk
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction // Используем AnyAction вместо Action<string>
>;

export default store;