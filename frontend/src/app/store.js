import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/slice';

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
});
