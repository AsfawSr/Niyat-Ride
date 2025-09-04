import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
// Async thunk to fetch vehicle types
export const fetchVehicles = createAsyncThunk(
  "vehicleTypes/fetchVehicleTypes",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("api/admin/vehicle-types/active"); // update with your actual endpoint
      return response.data.data.vehicles || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// Initial state
const initialState = {
  vehicles: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};
// Create slice
const vehicleSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vehicles = action.payload;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch vehicle types";
      });
  },
});

export const vehicleActions = vehicleSlice.actions;
export default vehicleSlice.reducer;
