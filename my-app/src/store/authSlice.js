import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
const initialState = {
  userId: null,
  email: null,
  firstName: null,
  role: null,
  token: null,
  isAuthenticated: false,
  status: false,
  error: null,
};
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    console.log(credentials);
    try {
      const response = await api.post("/api/auth/login", credentials);
      console.log(response);
      return response.data; // Expecting { data: { user }, token }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = true;
        const data = action.payload;
        console.log(data);
        state.email = data.email;
        state.token = data.token;
        state.firstName = data.firstName;
        state.userId = data.userId;
        state.role = data.role;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = false;
        state.error = action.payload;
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
