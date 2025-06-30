import { configureStore } from '@reduxjs/toolkit';
import { problemAPI } from '../api/problemAPI.js';
import { authAPI } from '../api/authAPI.js'; 
import authReducer from '../reducers/authReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [problemAPI.reducerPath]: problemAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPI.middleware, problemAPI.middleware),
});

export default store;