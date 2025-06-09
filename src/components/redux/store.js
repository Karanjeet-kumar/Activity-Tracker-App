import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import formSlice from "./formSlice";
import activitySlice from "./activitySlice";
import taskSlice from "./taskSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "activity-tracker-store",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
  form: formSlice,
  activity: activitySlice,
  task: taskSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
