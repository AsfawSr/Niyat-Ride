const initialState = {
  trips: [],
  nearbyDrivers: {}, // store drivers per tripId
  loading: false,
  driversLoading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};
const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    setTripsFromSocket(state, action) {
      state.trips = action.payload;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearError(state) {
      state.error = null;
    },
    clearState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch Trips ---
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- Fetch Nearby Drivers ---
      .addCase(fetchNearbyDrivers.pending, (state) => {
        state.driversLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyDrivers.fulfilled, (state, action) => {
        state.driversLoading = false;
        state.nearbyDrivers[action.payload.tripId] = action.payload.drivers;
      })
      .addCase(fetchNearbyDrivers.rejected, (state, action) => {
        state.driversLoading = false;
        state.error = action.payload;
      })

      // --- Reassign Trip ---
      .addCase(reassignTripAPI.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(reassignTripAPI.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.trips = state.trips.map((t) =>
          t.id === action.payload.id ? action.payload : t
        );
        state.successMessage = "Trip reassigned successfully!";
      })
      .addCase(reassignTripAPI.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // --- Cancel Trip ---
      .addCase(cancelTripAPI.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelTripAPI.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.trips = state.trips.filter((t) => t.id !== action.payload);
        state.successMessage = "Trip cancelled successfully!";
      })
      .addCase(cancelTripAPI.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // --- Emergency Trip ---
      .addCase(emergencyTripAPI.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(emergencyTripAPI.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.successMessage = "Emergency reported!";
      })
      .addCase(emergencyTripAPI.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
// --- Fallback fetch for trips (snapshot) ---
export const fetchTrips = createAsyncThunk(
  "trips/fetchTrips",
  async (query = "", { rejectWithValue }) => {
    try {
      const res = await api.get("/api/trips/active", query);
      return res.data; // snapshot of ongoing trips
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// --- Fetch nearby drivers for a specific trip ---
export const fetchNearbyDrivers = createAsyncThunk(
  "trips/fetchNearbyDrivers",
  async (tripId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/drivers/nearby?tripId=${tripId}`);
      return { tripId, drivers: res.data }; // include tripId for per-trip mapping
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Reassign trip ---
export const reassignTripAPI = createAsyncThunk(
  "trips/reassignTripAPI",
  async ({ tripId, driverId }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/trips/${tripId}/reassign`, { driverId });
      return res.data; // updated trip
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Cancel trip ---
export const cancelTripAPI = createAsyncThunk(
  "trips/cancelTripAPI",
  async (tripId, { rejectWithValue }) => {
    try {
      await api.put(`/api/trips/${tripId}/cancel`);
      return tripId; // only tripId needed to remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// --- Emergency ---
export const emergencyTripAPI = createAsyncThunk(
  "trips/emergencyTripAPI",
  async ({ tripId, note }, { rejectWithValue }) => {
    try {
      await api.post(`/api/trips/${tripId}/emergency`, { note });
      return { tripId, note };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const {
  setTripsFromSocket,
  clearState,
  clearSuccessMessage,
  clearError,
} = tripSlice.actions;
export default tripSlice.reducer;
