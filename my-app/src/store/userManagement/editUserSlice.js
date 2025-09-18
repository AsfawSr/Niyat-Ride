import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

const endpoints = {
  admin: "admins",
  dispatcher: "dispatchers",
  DRIVER: "drivers",
  CUSTOMER: "customers",
};

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const editUserSlice = createSlice({
  name: "editUser",
  initialState,
  reducers: {
    clearState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(editUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.success = false;
      });
  },
});

export const editUser = createAsyncThunk(
  "users/editUser",
  async ({ formData, id, role }, { rejectWithValue }) => {
    console.log(role)
    try {
const endpoint = endpoints[role];
      if (!endpoint) throw new Error(`Invalid role: ${role}`);

      const url = `/api/admin/${endpoint}/${id}/status`;

      const res = await api.patch(url, {
        status:formData.status
      }, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const { clearState } = editUserSlice.actions;
export default editUserSlice.reducer;
