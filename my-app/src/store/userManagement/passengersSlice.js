import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Async thunk to fetch passengers
export const fetchPassengers = createAsyncThunk(
  "passengers/fetchPassengers",
  async (payload = {}, thunkAPI) => {
    try {
      if (payload.id) {
        // Fetch single passenger by ID
        const response = await api.get(`/passengers/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }

      // Fetch list (with optional search)
      const params = payload.search ? { search: payload.search } : {};
      const response = await api.get("/passengers", { params });
      return { type: "list", data: response.data.data.passengers || [] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  passengers: [],
  selectedPassenger: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Slice
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
