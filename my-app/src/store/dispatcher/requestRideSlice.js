import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";



const requestRideSLice = createSlice({
  name: "requestRide",
  initialState: {
    loading: false,
    rideId: null,       
    nearDrivers: [],
    error: null,
  },
  reducers: {
    clearRideState: (state) => {
      state.rideId = null; 
      state.nearDrivers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload;
        state.rideId = action.payload?.Id || null;
        state.nearDrivers = action.payload?.nearbyDrivers || [];
      })
      .addCase(requestRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const requestRide = createAsyncThunk(
  "ride/requestRide",
  async ({ payload }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/dispatcher/rides", payload, {
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to request ride"
      );
    }
  }
);
export const { clearRideState } = requestRideSLice.actions;
export default requestRideSLice.reducer;
