// src/store/dashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api"; // your axios instance (reads VITE_BASE_URL)

// --- Async thunks ---
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchDashboardSummary",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/dashboard/summary");
      // backend often returns { success, message, data }
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchUserSummary = createAsyncThunk(
  "dashboard/fetchUserSummary",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/dashboard/users/summary");
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchRideSummary = createAsyncThunk(
  "dashboard/fetchRideSummary",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/rides/summary");
      return res.data?.data ?? res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const fetchRecentRides = createAsyncThunk(
  "dashboard/fetchRecentRides",
  async (_, thunkAPI) => {
    try {
      const res = await api.get(
        "/api/admin/rides?page=0&size=5&sortBy=requestedAt&sortDirection=desc"
      );
      // either backend returns { content: [...] } or an array
      if (res.data?.data) return res.data.data;
      if (Array.isArray(res.data)) return res.data;
      if (res.data?.content) return res.data.content;
      // fallback
      return [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// --- Slice ---
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashboardSummary: null,
    userSummary: null,
    rideSummary: null,
    recentRides: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.dashboardSummary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      // user summary
      .addCase(fetchUserSummary.fulfilled, (state, action) => {
        state.userSummary = action.payload;
      })
      // ride summary
      .addCase(fetchRideSummary.fulfilled, (state, action) => {
        state.rideSummary = action.payload;
      })
      // recent rides
      .addCase(fetchRecentRides.fulfilled, (state, action) => {
        state.recentRides = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
