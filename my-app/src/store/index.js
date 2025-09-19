// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// ✅ Auth slices
import loginReducer from "./authentication/loginSlice.js";
import registrationReducer from "./authentication/registrationSlice.js";

// Global error
import errorReducer from "./globalErrorSlice.js";

// ✅ Dispatcher slices
import activeVehiclesReducer from "./dispatcher/activeVehiclesSlice.js";
import requestRideReducer from "./dispatcher/requestRideSlice.js";
import assignRideReducer from "./dispatcher/assignRideSlice.js";
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
import dashboardReducer from "./dashboardSlice.js";

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
    // Auth
    auth: persistedAuthReducer,
    registration: registrationReducer,
    error: errorReducer,

    // Dispatcher
    activeVehicles: activeVehiclesReducer,
    requestRide: requestRideReducer,
    assignRide: assignRideReducer,
    trips: tripsReducer,

    // User management
    admins: adminsReducer,
    editUser: editUserReducer,
    passengers: passengersReducer,
    drivers: driversReducer,
    dispatchers: dispatchersReducer,

    // Your modules
    rides: ridesReducer,
    vehicles: vehiclesReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

export const persistor = persistStore(store);
