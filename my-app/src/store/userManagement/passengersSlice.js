import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const fetchPassengers = createAsyncThunk(
  "passengers/fetchPassengers",
  async (payload = {}, thunkAPI) => {
    try {
      if (payload.id) {
        const response = await api.get(`/passengers/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }
      const params = {
        search: payload.search || "",
        page: payload.page || 1,
        size: payload.limit || 10,
      };
      const response = await api.get("/api/admin/customers", { query:params });
      return {
        type: "list",
        data: response.data.data.content || [],
        totalPages: response.data.data.totalPages || 1,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  passengers: [],
  selectedPassenger: null,
  totalPages: 1,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

// Slice
const passengersSlice = createSlice({
  name: "passengers",
  initialState,
  reducers: {
    clearState(state) {
      Object.assign(state, initialState);
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
          state.totalPages = action.payload.totalPages;
        }

        if (action.payload.type === "detail") {
          state.selectedPassenger = action.payload.data;
        }
      })
      .addCase(fetchPassengers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch passengers";
      });
  },
});

export const { clearState } = passengersSlice.actions;
export default passengersSlice.reducer;
