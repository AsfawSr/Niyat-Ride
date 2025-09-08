import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
const endpoints = {
  admin: "admins/updateAdmin/",
  dispatcher: "dispatchers/updateDispatchers/",
  driver: "drivers/updateDriver/",
  passenger: "passengers/updatePassenger/",
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
      .addCase(editUser.fulfilled, (state, action) => {
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
  async ({ formdata, id, role }, { rejectWithValue }) => {
    try {
      const url = endpoints[role] || "";
      const res = await api.put(`api/${url}${id}`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const { clearState } = editUserSlice.actions;

export default editUserSlice.reducer;
