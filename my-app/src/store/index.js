import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import errorReducer from "./errorSlice.jsx";
import vehicles from "./vehiclesDispatcherSlice.jsx";
import allusersReducer from "./userManagement/allUsersSlice.js";
import passengersReducer from "./userManagement/passengersSlice.js";
import driversReducer from "./userManagement/driversSlice.js";
import dispatchersReducer from "./userManagement/dispatchersSlice.js";
import { setupInterceptors } from "../api/api.jsx";
const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
    vehiclesDispacher: vehicles,
    allUsers: allusersReducer,
    passengers: passengersReducer,
    drivers: driversReducer,
    dispatchers: dispatchersReducer,
  },
});
setupInterceptors(store);
export default store;
