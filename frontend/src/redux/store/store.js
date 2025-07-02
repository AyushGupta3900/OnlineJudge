import { configureStore } from "@reduxjs/toolkit";
import { authAPI } from "../api/authAPI.js";
import { problemAPI } from "../api/problemAPI.js";
import { compilerAPI } from "../api/compilerAPI.js";
import { submissionAPI } from "../api/submissionAPI.js";
import authReducer from "../reducers/authReducer.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [problemAPI.reducerPath]: problemAPI.reducer,
    [compilerAPI.reducerPath]: compilerAPI.reducer,
    [submissionAPI.reducerPath]: submissionAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(problemAPI.middleware)
      .concat(compilerAPI.middleware)
      .concat(submissionAPI.middleware),
});

export default store;