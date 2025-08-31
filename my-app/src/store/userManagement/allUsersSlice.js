import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",

  async (payload = {}, thunkAPI) => {
    try {
      // If payload has id → fetch details
      if (payload.id) {
        const response = await api.get(`/users/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }

      // Otherwise, fetch list (with optional search)
      const params = payload.search ? { search: payload.search } : {};
      const response = await api.get("/users", { params });
      return { type: "list", data: response.data.data.users || [] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  allUsers: [],
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null,
};

// Create slice
const allUserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    removeUser(state, action) {
      const { userId } = action.payload;
      state.allUsers = state.allUsers.filter((u) => u.id !== userId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allUsers = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch users";
      });
  },
});

export const userActions = allUserSlice.actions;
export default allUserSlice.reducer;
