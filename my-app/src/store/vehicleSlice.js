// src/store/vehicleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api"; // your axios instance used elsewhere

// Helper to try to extract the "useful" payload from different API shapes
const extractData = (res) => {
  if (!res) return null;
  // Typical backend wrapper: { success, message, data: ... }
  if (res.data && res.data.data !== undefined) return res.data.data;
  // Fallback: maybe the API returns the DTO directly
  if (res.data !== undefined) return res.data;
  return res;
};

/**
 * Thunks
 */

// Fetch vehicle types (supports optional query params: { page, size, search, isActive, ... })
export const fetchVehicleTypes = createAsyncThunk(
  "vehicles/fetchVehicleTypes",
  async (params = {}, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/vehicle-types", { params });
      console.info(res.data.data.content);
      return res.data.data.content;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a vehicle-type (accepts { name, pricePerKm, description, image (base64 or URL), capacity, features, isActive })
export const createVehicleType = createAsyncThunk(
  "vehicles/createVehicleType",
  async (payload, thunkAPI) => {
    try {
      const res = await api.post("/api/admin/vehicle-types", payload);
      const data = extractData(res);
      // some APIs return { data: {...} } while others return DTO directly
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update vehicle-type by id (payload should include id and the update fields)
export const updateVehicleType = createAsyncThunk(
  "vehicles/updateVehicleType",
  async (payload, thunkAPI) => {
    try {
      if (!payload?.id) throw new Error("Missing id for updateVehicleType");
      const { id, ...body } = payload;
      const res = await api.put(`/api/admin/vehicle-types/${id}`, body);
      const data = extractData(res);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete (soft) vehicle type
export const deleteVehicleType = createAsyncThunk(
  "vehicles/deleteVehicleType",
  async (id, thunkAPI) => {
    try {
      const res = await api.delete(`/api/admin/vehicle-types/${id}`);
      const data = extractData(res);
      // return id so reducer can remove it
      return { id, resData: data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Toggle status (PATCH /api/admin/vehicle-types/{id}/status) with { isActive: boolean }
export const updateVehicleTypeStatus = createAsyncThunk(
  "vehicles/updateVehicleTypeStatus",
  async ({ id, isActive }, thunkAPI) => {
    try {
      const res = await api.patch(`/api/admin/vehicle-types/${id}/status`, {
        isActive,
      });
      const data = extractData(res);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

/**
 * Slice
 */
const initialState = {
  list: [], // array of vehicle-type DTOs
  status: "idle",
  error: null,
  // optionally pager metadata
  meta: null,
};

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    // local helpers if needed
    clearVehicles(state) {
      state.list = [];
      state.status = "idle";
      state.error = null;
      state.meta = null;
    },
  },
  extraReducers: (builder) => {
    // fetchVehicleTypes
    builder
      .addCase(fetchVehicleTypes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        // action.payload might be:
        // - an array
        // - an object { data: [ ... ], totalPages: n, ... }
        const payload = action.payload;
        if (!payload) {
          state.list = [];
          state.meta = null;
        } else if (Array.isArray(payload)) {
          state.list = payload;
          state.meta = null;
        } else if (payload.data && Array.isArray(payload.data)) {
          state.list = payload.data;
          state.meta = { ...payload, data: undefined };
        } else if (
          payload.vehicleTypes &&
          Array.isArray(payload.vehicleTypes)
        ) {
          state.list = payload.vehicleTypes;
          state.meta = { ...payload, vehicleTypes: undefined };
        } else {
          // fallback: single DTO or object -> wrap in array
          if (payload.id || payload.name) {
            state.list = [payload];
          } else {
            state.list = [];
          }
          state.meta = null;
        }
      })
      .addCase(fetchVehicleTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // createVehicleType
    builder
      .addCase(createVehicleType.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createVehicleType.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload;
        // payload likely a DTO object
        if (payload && payload.id) {
          state.list.unshift(payload);
        } else if (payload?.data && payload.data.id) {
          state.list.unshift(payload.data);
        }
      })
      .addCase(createVehicleType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // updateVehicleType
    builder
      .addCase(updateVehicleType.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateVehicleType.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload;
        // find by id and replace
        const updated = payload?.id
          ? payload
          : payload?.data
          ? payload.data
          : null;
        if (updated && updated.id) {
          const idx = state.list.findIndex(
            (v) => String(v.id) === String(updated.id)
          );
          if (idx !== -1) state.list[idx] = updated;
        }
      })
      .addCase(updateVehicleType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // deleteVehicleType
    builder
      .addCase(deleteVehicleType.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteVehicleType.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id } = action.payload || {};
        state.list = state.list.filter((v) => String(v.id) !== String(id));
      })
      .addCase(deleteVehicleType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });

    // updateVehicleTypeStatus (we'll try to merge updated DTO)
    builder
      .addCase(updateVehicleTypeStatus.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateVehicleTypeStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        const payload = action.payload;
        const updated = payload?.id
          ? payload
          : payload?.data
          ? payload.data
          : null;
        if (updated && updated.id) {
          const idx = state.list.findIndex(
            (v) => String(v.id) === String(updated.id)
          );
          if (idx !== -1) state.list[idx] = updated;
        }
      })
      .addCase(updateVehicleTypeStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearVehicles } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
