import { createSlice } from "@reduxjs/toolkit";
import { fetchPassengers } from "./passengersThunk";

const initialState = {
  passengers: [],
  selectedPassenger: null,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const passengersSlice = createSlice({
  name: "passengers",
  initialState,
  reducers: {
    removePassenger(state, action) {
      const { id } = action.payload;
      state.passengers = state.passengers.filter((p) => p.id !== id);
    },
    clearSelectedPassenger(state) {
      state.selectedPassenger = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPassengers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPassengers.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.type === "list") {
          state.passengers = action.payload.data;
        } else if (action.payload.type === "detail") {
          state.selectedPassenger = action.payload.data;
        }
      })
      .addCase(fetchPassengers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch passengers";
      });
  },
});

export const passengersActions = passengersSlice.actions;
export default passengersSlice.reducer;
