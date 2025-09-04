import { createBrowserRouter } from "react-router-dom";

// Layouts
import RootLayout from "../Pages/RootLayout";
import DispatcherLayout from "../layouts/DispatcherLayout";

// Auth & shared
import Login from "../Pages/Login";
import ProtectedRoute from "../Components/ProtectedRoute";

// Admin pages
import Dashboard from "../Pages/Dashboard";
import Dispatchers from "../Pages/userManagement/Dispatchers";
import Passengers from "../Pages/userManagement/Passengers";
import Drivers from "../Pages/userManagement/Drivers";

// Ride Management
import AllRides from "../Pages/RideManagement/AllRides";
import CancelledRides from "../Pages/RideManagement/CancelledRides";
import OngoingRides from "../Pages/RideManagement/OngoingRides";
import CompletedRides from "../Pages/RideManagement/CompletedRides";
// Dispatcher
import LiveMap from "../Pages/dispatcher/LiveMap";
import ManualDispatch from "../Pages/dispatcher/manualDispatch/ManualDispatch.jsx";
import Admins from "../Pages/userManagement/Admins.jsx";
import Signup from "../Pages/Signup.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "signup/:role", element: <Signup /> },

      // ---- Admin routes ----
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      { path: "admin/admins", element: <Admins /> },
      { path: "admin/users/drivers", element: <Drivers /> },
      { path: "admin/users/passengers", element: <Passengers /> },
      { path: "admin/users/dispatchers", element: <Dispatchers /> },

      { path: "admin/rides", element: <AllRides /> },
      { path: "admin/ongoing", element: <OngoingRides /> },
      { path: "admin/completed", element: <CompletedRides /> },
      { path: "admin/cancelled", element: <CancelledRides /> },

      // Legacy aliases (optional)
      { path: "admins", element: <Admins /> },
      { path: "drivers", element: <Drivers /> },
      { path: "passengers", element: <Passengers /> },
      { path: "dispatchers", element: <Dispatchers /> },
      { path: "admin/Ongoing", element: <OngoingRides /> },
      { path: "admin/Completed", element: <CompletedRides /> },
    ],
  },

  // ---- Dispatcher ----
  {
    path: "/dispatcher",
    element: (
      <ProtectedRoute allowedRoles={["Admin", "dispatcher"]}>
        <DispatcherLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LiveMap /> },
      { path: "livemap", element: <LiveMap /> },
      { path: "manualAssignment", element: <ManualDispatch /> },
    ],
  },
]);

export default router;
