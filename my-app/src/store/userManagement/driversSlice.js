import { createSlice } from "@reduxjs/toolkit";
import { fetchDrivers } from "./driversThunk";

const initialState = {
  drivers: [],
  selectedDriver: null,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    removeDriver(state, action) {
      const { id } = action.payload;
      state.drivers = state.drivers.filter((d) => d.id !== id);
    },
    clearSelectedDriver(state) {
      state.selectedDriver = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.type === "list") {
          state.drivers = action.payload.data;
        } else if (action.payload.type === "detail") {
          state.selectedDriver = action.payload.data;
        }
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch drivers";
      });
  },
});

export const driversActions = driversSlice.actions;
export default driversSlice.reducer;
