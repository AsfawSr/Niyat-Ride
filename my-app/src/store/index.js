// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// ✅ Auth slices
import loginReducer from "./authentication/loginSlice.js";
import registrationReducer from "./authentication/registrationSlice.js";

// ✅ Global error
import errorReducer from "./globalErrorSlice.js";

// ✅ Dispatcher slices
import activeVehiclesReducer from "./dispatcher/activeVehiclesSlice.js";
import tripsReducer from "./dispatcher/tripSlice.js";

// ✅ User management slices
import adminsReducer from "./userManagement/adminSlice.js";
import passengersReducer from "./userManagement/passengersSlice.js";
import editUserReducer from "./userManagement/editUserSlice.js";
import driversReducer from "./userManagement/driversSlice.js";
import dispatchersReducer from "./userManagement/dispatchersSlice.js";

// ✅ Your slices
import ridesReducer from "./ridesSlice.js";
import vehiclesReducer from "./vehicleSlice.js";

// ===== NEW: dashboard slice =====
import dashboardReducer from "./dashboardSlice.js";

// import { setupInterceptors } from "../api/api.jsx"; // optional: to attach auth token to api

// --- Persist config for auth ---
const persistedConfig = {
  key: "auth",
  storage,
  whitelist: ["firstName", "userId", "isAuthenticated", "role"],
};
const persistedAuthReducer = persistReducer(persistedConfig, loginReducer);

// --- Store setup ---
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    registration: registrationReducer,
    error: errorReducer,
    activeVehicles: activeVehiclesReducer,
    admins: adminsReducer,
    editUser: editUserReducer,
    passengers: passengersReducer,
    drivers: driversReducer,
    dispatchers: dispatchersReducer,
    trips: tripsReducer,

    // your slices
    rides: ridesReducer,
    vehicles: vehiclesReducer,

    // dashboard (added)
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

// optional: setup interceptors if you implemented setupInterceptors in api file
// setupInterceptors(store);

export const persistor = persistStore(store);
