import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Async thunk to fetch dispatchers
export const fetchDispatchers = createAsyncThunk(
  "dispatchers/fetchDispatchers",
  async (payload = {}, thunkAPI) => {
    try {
      if (payload.id) {
        // Fetch single dispatcher by ID
        const response = await api.get(`/dispatchers/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }

      // Fetch list (with optional search)
      const params = payload.search ? { search: payload.search } : {};
      const response = await api.get("/dispatchers", { params });
      return { type: "list", data: response.data.data.dispatchers || [] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  allDispatchers: [],
  dispatcherDetail: null,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Slice
const dispatchersSlice = createSlice({
  name: "dispatchers",
  initialState,
  reducers: {
    removeDispatcher(state, action) {
      const { dispatcherId } = action.payload;
      state.allDispatchers = state.allDispatchers.filter(
        (d) => d.id !== dispatcherId
      );
    },
    clearDispatcherDetail(state) {
      state.dispatcherDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDispatchers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDispatchers.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (action.payload.type === "list") {
          state.allDispatchers = action.payload.data;
        } else if (action.payload.type === "detail") {
          state.dispatcherDetail = action.payload.data;
        }
      })
      .addCase(fetchDispatchers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch dispatchers";
      });
  },
});

export const dispatcherActions = dispatchersSlice.actions;
export default dispatchersSlice.reducer;
