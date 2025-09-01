import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import errorReducer from "./globalErrorSlice.js";
import vehicles from "./vehiclesDispatcherSlice.js";
import adminsReducer from "./userManagement/adminSlice.js";
import passengersReducer from "./userManagement/passengersSlice.js";
import driversReducer from "./userManagement/driversSlice.js";
import dispatchersReducer from "./userManagement/dispatchersSlice.js";
import { setupInterceptors } from "../api/api.jsx";
const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
    vehiclesDispacher: vehicles,
    admins: adminsReducer,
    passengers: passengersReducer,
    drivers: driversReducer,
    dispatchers: dispatchersReducer,
  },
});
setupInterceptors(store);
export default store;
