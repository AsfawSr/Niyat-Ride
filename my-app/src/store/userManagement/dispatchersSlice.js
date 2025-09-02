export const fetchDispatchers = createAsyncThunk(
  "dispatchers/fetchDispatchers",
  async (payload = {}, thunkAPI) => {
    try {
      // If fetching detail
      if (payload.id) {
        const response = await api.get(`/dispatchers/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }

      // For list with pagination and optional search
      const params = {
        search: payload.search || "",
        page: payload.page || 1,
        limit: payload.limit || 10,
      };

      const response = await api.get("/dispatchers", { params });

      return {
        type: "list",
        data: response.data.data.dispatchers || [],
        totalPages: response.data.data.totalPages || 1, // <-- Get total pages
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  dispatchers: [],
  dispatcherDetail: null,
  totalPages: 1,
  loading: false,
  error: null,
};
const dispatchersSlice = createSlice({
  name: "dispatchers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDispatchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDispatchers.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.type === "list") {
          state.dispatchers = action.payload.data;
          state.totalPages = action.payload.totalPages; // ✅ Update totalPages
        }

        if (action.payload.type === "detail") {
          state.dispatcherDetail = action.payload.data;
        }
      })
      .addCase(fetchDispatchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default dispatchersSlice.reducer;
