import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.jsx";
import errorReducer from "./errorSlice.jsx";
import ridesReducer from "./ridesSlice.js"; // ✅ NEW: Import the rides slice reducer
import { setupInterceptors } from "../api/api.jsx";

const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
    rides: ridesReducer, // ✅ NEW: Add the rides reducer to your store
  },
});

setupInterceptors(store);

export default store;
