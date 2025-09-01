import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Thunk: fetch admins (list with pagination & search, or single detail)
export const fetchAdmins = createAsyncThunk(
  "admins/fetchAdmins",
  async (payload = {}, thunkAPI) => {
    try {
      // Fetch single admin details
      if (payload.id) {
        const response = await api.get(`/admins/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }

      // Fetch list with optional search, pagination
      const params = {
        search: payload.search || "",
        page: payload.page || 1,
        limit: payload.limit || 10
      };

      const response = await api.get("/admins", { params });

      return {
        type: "list",
        data: response.data.data.admins || [],
        totalPages: response.data.data.totalPages || 1
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  admins: [],
  adminDetail: null,
  totalPages: 1,
  status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  error: null
};

// Slice
const adminsSlice = createSlice({
  name: "admins",
  initialState,
  reducers: {
    removeAdmin(state, action) {
      const { adminId } = action.payload;
      state.admins = state.admins.filter((a) => a.id !== adminId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload.type === "list") {
          state.admins = action.payload.data;
          state.totalPages = action.payload.totalPages;
        }

        if (action.payload.type === "detail") {
          state.adminDetail = action.payload.data;
        }
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch admins";
      });
  }
});

export const adminActions = adminsSlice.actions;
export default adminsSlice.reducer;
