import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Login from "./Pages/Login";
import RootLayout from "./Pages/RootLayout";
import AdminSignup from "./Pages/AdminSignup";
import Dashboard from "./Pages/Dashboard";
import AllUsers from "./Pages/userManagement/AllUsers";
import Dispatchers from "./Pages/userManagement/Dispatchers";
import Passengers from "./Pages/userManagement/Passengers";
import Drivers from "./Pages/userManagement/Drivers";

// Dispatcher
import AllRides from "./Pages/RideManagement/AllRides";
import CancelledRides from "./Pages/RideManagement/CancelledRides";
import OngoingRides from "./Pages/RideManagement/OngoingRides";
import CompletedRides from "./Pages/RideManagement/CompletedRides";
import ProtectedRoute from "./Components/ProtectedRoute"; // ✅ role-based protection
import LiveMap from "./Pages/dispatcher/LiveMap";
import ManualDispatch from "./Pages/dispatcher/manualDispatch/ManualDispatch.jsx";
import Logout from "./Pages/Logout.jsx";
function App() {
  const [darkMode, setDarkmode] = useState(false);
  const toggleHandler = () => setDarkmode((prev) => !prev);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Login /> },
        { path: "signup", element: <AdminSignup /> },
        { path: "logout", element: <Logout /> },

        // ---- User Management (canonical paths) ----
        { path: "admin/users", element: <AllUsers /> },
        { path: "admin/users/drivers", element: <Drivers /> },
        { path: "admin/users/passengers", element: <Passengers /> },
        { path: "admin/users/dispatchers", element: <Dispatchers /> },
        // ---- User Management (legacy aliases; safe to keep for now) ----
        { path: "AllUsers", element: <AllUsers /> },
        { path: "drivers", element: <Drivers /> },
        { path: "passengers", element: <Passengers /> },
        { path: "dispatchers", element: <Dispatchers /> },
        // ---- Ride Management (canonical, lowercase) ----
        { path: "admin/rides", element: <AllRides /> },
        { path: "admin/ongoing", element: <OngoingRides /> },
        { path: "admin/completed", element: <CompletedRides /> },
        { path: "admin/cancelled", element: <CancelledRides /> },

        // ---- Ride Management (legacy aliases for backward compat) ----
        { path: "admin/Ongoing", element: <OngoingRides /> },
        { path: "admin/Completed", element: <CompletedRides /> },
        // ---- Dispatcher ----
        { path: "dispatcher/manualAssignment", element: <ManualDispatch /> },
        { path: "dispatcher/livemap", element: <LiveMap /> },

        // Optional 404
        // { path: "*", element: <PageNotFound /> },
        // ✅ Admin routes (accessible only to admin)
        {
          path: "dashboard",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "AllUsers",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllUsers />
            </ProtectedRoute>
          ),
        },
        {
          path: "passengers",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Passengers />
            </ProtectedRoute>
          ),
        },
        {
          path: "dispatchers",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dispatchers />
            </ProtectedRoute>
          ),
        },
        {
          path: "drivers",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Drivers />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/rides",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllRides />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/ongoing",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <OngoingRides />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/completed",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <CompletedRides />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/cancelled",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <CancelledRides />
            </ProtectedRoute>
          ),
        },

        // ✅ Dispatcher routes (accessible to both admin and dispatcher)
        // I've updated the allowedRoles prop to include "admin".
        {
          path: "dispacherPanel",
          element: (
            <ProtectedRoute allowedRoles={["admin", "dispatcher"]}>
              <LiveMap />
            </ProtectedRoute>
          ),
        },
        {
          path: "manualAssignment",
          element: (
            <ProtectedRoute allowedRoles={["admin", "dispatcher"]}>
              <ManualDispatch />
            </ProtectedRoute>
          ),
        },
        {
          path: "dispatcher/assign",
          element: (
            <ProtectedRoute allowedRoles={["admin", "dispatcher"]}>
              <ManualDispatch />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300 py-3">
        <RouterProvider router={router} />
        <button
          onClick={toggleHandler}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white shadow-md hover:scale-110 transition-transform"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </div>
  );
}

export default App;
