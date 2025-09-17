import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState = {
  status: "idle",
  error: null,
};
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ userData }, { rejectWithValue }) => {
    try {
      console.log(userData);
      const URL = userData.role === "Admin" ? "admins" : "dispatchers";
      console.log(URL);
      const response = await api.post(`/api/${URL}/signup`, userData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);
const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    clearState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { clearState } = registrationSlice.actions;

export default registrationSlice.reducer;
