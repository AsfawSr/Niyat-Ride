import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  errors: [],
};
const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError(state, action) {
      const { source, message, isNetworkError } = action.payload;
      if (isNetworkError) {
        state.errors = [{ source: "Network", message }];
      } else {
        const existingErrorIndex = state.errors.findIndex(
          (err) => err.source === source
        );
        if (existingErrorIndex !== -1) {
          state.errors[existingErrorIndex].message = message;
        } else {
          state.errors.push({ source, message });
        }
      }
    },
    clearError(state, action) {
      if (action.payload) {
        state.errors = state.errors.filter(
          (err) => err.source !== action.payload
        );
      } else {
        state.errors = [];
      }
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
