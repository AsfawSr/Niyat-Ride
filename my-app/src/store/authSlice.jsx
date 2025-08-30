import { createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
// Initial state
const initialState = {
  userId: null,
  email: null,
  firstName: null,
  role: null, //
  isAuthenticated: false, // Flag to check if the user is logged in
  token: null,
};
// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, { payload }) {
      const { email, firstName, name, userId, token, role } = payload;
      state.email = email;
      state.name = name;
      state.firstName = firstName;
      state.role = role;
      state.userId = userId;
      state.isAuthenticated = true;
      state.token = token; //temporarly I stored here
    },
    logout(state) {
      // Reset state
      Object.assign(state, initialState);
    },
  },
});
// Asynchronous checkAuth function (using a thunk)
export const checkAuth = () => async (dispatch) => {
  try {
    // Make an API request to check if the user is authenticated
    const res = await api.get("/auth/check", {});
    const { email, firstName, _id, role } = res.data;
    const name = role === "dispacher" ? dispacher : firstName;
    dispatch(authActions.login({ email, name, _id, role }));
  } catch (error) {
    // If there's an error (e.g., the session expired), dispatch logout
    dispatch(authActions.logout());
  }
};
// Export actions and reducer
export const authActions = authSlice.actions;
export default authSlice.reducer;
