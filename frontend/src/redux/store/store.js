import { configureStore } from '@reduxjs/toolkit';
import { authAPI } from '../api/authAPI.js';
import { problemAPI } from '../api/problemAPI.js';
import { submissionAPI } from '../api/submissionAPI.js'; 
import authReducer from '../reducers/authReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [problemAPI.reducerPath]: problemAPI.reducer,
    [submissionAPI.reducerPath]: submissionAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      problemAPI.middleware,
      submissionAPI.middleware 
    ),
});

export default store;
