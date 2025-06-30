import { configureStore } from '@reduxjs/toolkit';
import { authAPI } from '../api/authAPI.js';
import authReducer from '../reducers/authReducer.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPI.middleware),
  devTools: import.meta.env.MODE !== 'production', 
});

export default store;