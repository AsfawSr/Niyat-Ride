import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Async thunk to fetch drivers (list with pagination & search, or single detail)
export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",
  async (payload = {}, thunkAPI) => {
    try {
      // Fetch single driver by ID
      if (payload.id) {
        const response = await api.get(`/drivers/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }

      // Fetch list with optional search and pagination
      const params = {
        search: payload.search || "",
        page: payload.page,
        size: payload.limit,
      };

      const response = await api.get("/api/driver/drivers", { params });
      console.log(response);

      return {
        type: "list",
        data: response.data.data.drivers || [],
        totalPages: response.data.data.totalPages || 1,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  drivers: [],
  selectedDriver: null,
  totalPages: 1,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

// Slice
const driversSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    clearState(state) {
      Object.assign(state, initialState);
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
          state.totalPages = action.payload.totalPages;
        }
        if (action.payload.type === "detail") {
          state.selectedDriver = action.payload.data;
        }
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch drivers";
      });
  },
});
export const { clearState } = driversSlice.actions;
export default driversSlice.reducer;
