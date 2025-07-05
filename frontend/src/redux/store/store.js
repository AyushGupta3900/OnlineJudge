import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../reducers/authReducer.js";
import codeReducer from "../reducers/codeReducer.js";

import { authAPI } from "../api/authAPI.js";
import { problemAPI } from "../api/problemAPI.js";
import { compilerAPI } from "../api/compilerAPI.js";
import { submissionAPI } from "../api/submissionAPI.js";
import { contactAPI } from "../api/contactAPI.js";

const authPersistConfig = {
  key: "auth",
  storage,
};

const codePersistConfig = {
  key: "code",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCodeReducer = persistReducer(codePersistConfig, codeReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    code: persistedCodeReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [problemAPI.reducerPath]: problemAPI.reducer,
    [compilerAPI.reducerPath]: compilerAPI.reducer,
    [submissionAPI.reducerPath]: submissionAPI.reducer,
    [contactAPI.reducerPath]: contactAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    })
      .concat(authAPI.middleware)
      .concat(problemAPI.middleware)
      .concat(compilerAPI.middleware)
      .concat(submissionAPI.middleware)
      .concat(contactAPI.middleware),
});

export const persistor = persistStore(store);
export default store;
