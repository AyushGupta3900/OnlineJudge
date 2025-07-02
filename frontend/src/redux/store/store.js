import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../reducers/authReducer.js";

import { authAPI } from "../api/authAPI.js";
import { problemAPI } from "../api/problemAPI.js";
import { compilerAPI } from "../api/compilerAPI.js";
import { submissionAPI } from "../api/submissionAPI.js";

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [problemAPI.reducerPath]: problemAPI.reducer,
    [compilerAPI.reducerPath]: compilerAPI.reducer,
    [submissionAPI.reducerPath]: submissionAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    })
      .concat(authAPI.middleware)
      .concat(problemAPI.middleware)
      .concat(compilerAPI.middleware)
      .concat(submissionAPI.middleware),
});

export const persistor = persistStore(store);
export default store;