import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async thunk must be declared first
export const assignRide = createAsyncThunk(
  "ride/assignRide",
  async ({ data }, { rejectWithValue }) => {
    try {
      const url = `/api/dispatcher/rides/${data.rideId}/assign-driver`;
      const response = await api.patch(url, {
        ...data
      });
      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign ride"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  status: "idle",
};
const assignRideSlice = createSlice({
  name: "assignRide",
  initialState,
  reducers: {
    clearRideState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignRide.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(assignRide.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearRideState } = assignRideSlice.actions;
export default assignRideSlice.reducer;
