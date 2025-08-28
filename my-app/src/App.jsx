import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import Login from "./Pages/Login";
import RootLayout from "./Pages/RootLayout";
import AdminSignup from "./Pages/AdminSignup";
import Dashboard from "./Pages/Dashboard";

// User Management
import AllUsers from "./Pages/userManagement/AllUsers";
import Dispatchers from "./Pages/userManagement/Dispatchers";
import Passengers from "./Pages/userManagement/Passengers";
import Drivers from "./Pages/userManagement/Drivers";

// Ride Management
import AllRides from "./Pages/RideManagement/AllRides";
import CancelledRides from "./Pages/RideManagement/CancelledRides";
import OngoingRides from "./Pages/RideManagement/OngoingRides";
import CompletedRides from "./Pages/RideManagement/CompletedRides";

// Dispatcher
import LiveMap from "./Pages/dispatcher/LiveMap";
import ManualDispatch from "./Pages/dispatcher/manualDispatch/ManualDispatch.jsx";

// Components
import ProtectedRoute from "./Components/ProtectedRoute";
import Sidebar from "./Components/Sidebar";

// ---- Dispatcher Layout ----
import { Outlet } from "react-router-dom";
function DispatcherLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

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

        // ---- Admin routes ----
        {
          path: "dashboard",
          element: (
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        { path: "admin/users", element: <AllUsers /> },
        { path: "admin/users/drivers", element: <Drivers /> },
        { path: "admin/users/passengers", element: <Passengers /> },
        { path: "admin/users/dispatchers", element: <Dispatchers /> },

        { path: "admin/rides", element: <AllRides /> },
        { path: "admin/ongoing", element: <OngoingRides /> },
        { path: "admin/completed", element: <CompletedRides /> },
        { path: "admin/cancelled", element: <CancelledRides /> },

        // Legacy aliases (safe to keep for now)
        { path: "AllUsers", element: <AllUsers /> },
        { path: "drivers", element: <Drivers /> },
        { path: "passengers", element: <Passengers /> },
        { path: "dispatchers", element: <Dispatchers /> },
        { path: "admin/Ongoing", element: <OngoingRides /> },
        { path: "admin/Completed", element: <CompletedRides /> },
      ],
    },

    // ---- Dispatcher routes (with layout) ----
    {
      path: "/dispatcher",
      element: (
        <ProtectedRoute allowedRoles={["admin", "dispatcher"]}>
          <DispatcherLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <LiveMap /> }, // default landing for dispatcher
        { path: "livemap", element: <LiveMap /> },
        { path: "manualAssignment", element: <ManualDispatch /> },
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
