import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Thunk: fetch dispatchers (list with pagination & search, or single detail)
export const fetchDispatchers = createAsyncThunk(
  "dispatchers/fetchDispatchers",
  async (payload = {}, thunkAPI) => {
    try {
      // Fetch single dispatcher detail
      if (payload.id) {
        const response = await api.get(`/dispatchers/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }

      // Fetch list with optional search, pagination
      const params = {
        search: payload.search || "",
        page: payload.page || 1,
        size: payload.limit || 10,
      };
      const response = await api.get("/api/admin/dispatchers", {
        query:params,
      });

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
  dispatchers: [],
  dispatcherDetail: null,
  totalPages: 1,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

// Slice
const dispatchersSlice = createSlice({
  name: "dispatchers",
  initialState,
  reducers: {
    clearState(state) {
      Object.assign(state, initialState);
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
          state.dispatchers = action.payload.data;
          state.totalPages = action.payload.totalPages;
          state.dispatcherDetail = null; // optional: clear detail on list fetch
        }

        if (action.payload.type === "detail") {
          state.dispatcherDetail = action.payload.data;
        }
      })
      .addCase(fetchDispatchers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch dispatchers";
      });
  },
});

// Exports
export const { clearState } = dispatchersSlice.actions;
export default dispatchersSlice.reducer;
