import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { authActions } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const logoutUser = async () => {
      try {
        // Call the backend to logout and clear the cookie
        const res = await api.post("/auth/logout", { withCredentials: true });
        // Dispatch the logout action to Redux
        dispatch(authActions.logout());
        // Redirect to the homepage or login page
        navigate("/login");
      } catch (error) {
        alert(error);
      }
    };
    logoutUser();
  }, [dispatch, navigate]);
}

export default Logout;
