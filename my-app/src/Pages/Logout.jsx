import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice"; // use `logout` if that's your action name

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);
}

export default Logout;

// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { logout } from "../store/authSlice"; // use `logout` if that's your action name
// import api from "../api/api";

// function Logout() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const logoutUser = async () => {
//     try {
//       await api.post("/api/auth/logout", {}, { withCredentials: true });

//       dispatch(logout());

//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };
//   useEffect(() => {
//     logoutUser();
//   }, [dispatch, navigate]);

//   return <div>Logging out...</div>;
// }

// export default Logout;
