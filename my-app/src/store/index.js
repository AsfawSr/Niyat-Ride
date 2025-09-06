import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import errorReducer from "./globalErrorSlice.js";
import activeVehiclesReducer from "./dispatcher/activeVehiclesSlice.js";
import tripsReducer from "./dispatcher/tripSlice.js";

import adminsReducer from "./userManagement/adminSlice.js";
import passengersReducer from "./userManagement/passengersSlice.js";
import editUserReducer from "./userManagement/editUserSlice.js";

import driversReducer from "./userManagement/driversSlice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import dispatchersReducer from "./userManagement/dispatchersSlice.js";
// import { setupInterceptors } from "../api/api.jsx";
const persistedConfig = {
  key: "auth",
  storage,
  whitelist: ["firstName", "isAuthenticated", "role"],
};
const persistedAuthReducer = persistReducer(persistedConfig, authReducer);
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    error: errorReducer,
    activeVehicles: activeVehiclesReducer,
    admins: adminsReducer,
    editUser: editUserReducer,
    passengers: passengersReducer,
    drivers: driversReducer,
    dispatchers: dispatchersReducer,
    trips: tripsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});
// setupInterceptors(store);
export const persistor = persistStore(store);
