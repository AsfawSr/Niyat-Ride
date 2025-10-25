import { createSlice } from "@reduxjs/toolkit";
import { generateDummyRides } from "../Pages/RideManagement/rideData";

// Define the initial state for the rides slice.
const initialState = {
  rides: generateDummyRides(160),
};

// Create the rides slice using createSlice from Redux Toolkit.
const ridesSlice = createSlice({
  name: "rides",
  initialState,
  reducers: {
    // Action to update a ride.
    updateRide: (state, action) => {
      const updatedRide = action.payload;
      const index = state.rides.findIndex((r) => r.id === updatedRide.id);
      if (index !== -1) {
        state.rides[index] = updatedRide;
      }
    },
    // Action to finish a ride.
    finishRide: (state, action) => {
      const rideId = action.payload;
      const ride = state.rides.find((r) => r.id === rideId);
      if (ride) {
        ride.status = "Completed";
        ride.completedBy = "Admin"; 
      }
    },
    // Action to cancel a ride.
    cancelRide: (state, action) => {
      const rideId = action.payload;
      const ride = state.rides.find((r) => r.id === rideId);
      if (ride) {
        ride.status = "Cancelled";
        ride.fare = "$0.00";
      }
    },
    // Action to delete a ride.
    deleteRide: (state, action) => {
      const rideId = action.payload;
      state.rides = state.rides.filter((r) => r.id !== rideId);
    },
  },
});

export const { updateRide, finishRide, cancelRide, deleteRide } =
  ridesSlice.actions;

export default ridesSlice.reducer;
