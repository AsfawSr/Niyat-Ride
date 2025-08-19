import axios from "axios";
import { setError, clearError } from "../store/errorSlice";

const api = axios.create({
  // baseURL: "/3000/api/v1",
  withCredentials: true,
});
export const setupInterceptors = (store) => {
  api.interceptors.request.use(
    (config) => {
      // Get the token from Redux state (assuming you store it in authSlice)
      const token = store.getState().auth.token;
      if (token) {
        // Attach the token to the Authorization header
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      // Extract the request URL as the error source
      const source = response.config.url;
      // Clear the error related to this source if the request is successful
      store.dispatch(clearError(source));
      return response;
    },
    async (error) => {
      let errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      const isNetworkError = !error.response; // No response = Network issue
      const source = isNetworkError ? "Network" : error.config.url; // Identify the source
      // Store the error in Redux
      store.dispatch(
        setError({
          source,
          message: isNetworkError
            ? "Network error. Please check your connection."
            : errorMessage,
          isNetworkError,
        })
      );

      return Promise.reject(error);
    }
  );
};

export default api;
