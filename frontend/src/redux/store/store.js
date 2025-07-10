import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../reducers/authReducer.js";
import codeReducer from "../reducers/codeReducer.js";

import { baseApi } from "../api/baseAPI.js";
import { compilerAPI } from "../api/compilerAPI.js";
import { contactAPI } from "../api/contactAPI.js";
import { aiAPI} from "../api/aiAPI.js";

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
    [baseApi.reducerPath]: baseApi.reducer,
    [compilerAPI.reducerPath]: compilerAPI.reducer,
    [contactAPI.reducerPath]: contactAPI.reducer,
    [aiAPI.reducerPath]: aiAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(baseApi.middleware)
      .concat(compilerAPI.middleware)
      .concat(contactAPI.middleware)
      .concat(aiAPI.middleware),
});

export const persistor = persistStore(store);
export default store;
