import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.jsx";
import errorReducer from "./errorSlice.jsx";
import ridesReducer from "./ridesSlice.js"; 
import vehicleReducer from "./vehicleSlice.js"; // ✅ NEW: Import the vehicle slice
import { setupInterceptors } from "../api/api.jsx";

const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
    rides: ridesReducer,
    vehicles: vehicleReducer, // ✅ NEW: Add the vehicles reducer to store
  },
});

setupInterceptors(store);

export default store;
