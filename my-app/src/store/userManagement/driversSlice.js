import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async thunk to fetch drivers
export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",
  async (payload = {}, thunkAPI) => {
    try {
      if (payload.id) {
        // Fetch single driver by ID
        const response = await api.get(`/drivers/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }

      // Fetch list (with optional search)
      const params = payload.search ? { search: payload.search } : {};
      const response = await api.get("/drivers", { params });
      return { type: "list", data: response.data.data.drivers || [] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  drivers: [],
  selectedDriver: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Slice
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
