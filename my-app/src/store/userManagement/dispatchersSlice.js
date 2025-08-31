import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Async thunk to fetch dispatchers
export const fetchDispatchers = createAsyncThunk(
  "dispatchers/fetchDispatchers",
  /**
   * payload can be:
   * - undefined → fetch all
   * - { id: "123" } → fetch details
   * - { search: "term" } → search
   */
  async (payload = {}, thunkAPI) => {
    try {
      if (payload.id) {
        // Fetch single dispatcher by ID
        const response = await api.get(`/dispatchers/${payload.id}`);
        return { type: "detail", data: response.data.data };
      }

      // Fetch list (with optional search)
      const params = payload.search ? { search: payload.search } : {};
      const response = await api.get("/dispatchers", { params });
      return { type: "list", data: response.data.data.dispatchers || [] };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
