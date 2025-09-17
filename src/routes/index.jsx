import { createBrowserRouter } from "react-router-dom";

// Layouts
import RootLayout from "../Pages/RootLayout";
import DispatcherLayout from "../layouts/DispatcherLayout";

// Auth & shared
import Login from "../Pages/Login";
// import AdminSignup from "../Pages/AdminSignup"; // keep your signup
import Signup from "../Pages/Signup.jsx"; // keep bire signup
import Logout from "../Pages/Logout.jsx";
import ProtectedRoute from "../Components/ProtectedRoute";

// Admin pages
import Dashboard from "../Pages/Dashboard";
import Admins from "../Pages/userManagement/Admins.jsx";
// import AllUsers from "../Pages/userManagement/AllUsers";
import Dispatchers from "../Pages/userManagement/Dispatchers";
import Passengers from "../Pages/userManagement/Passengers";
import Drivers from "../Pages/userManagement/Drivers";

// Ride Management
import AllRides from "../Pages/RideManagement/AllRides";
import CancelledRides from "../Pages/RideManagement/CancelledRides";
import OngoingRides from "../Pages/RideManagement/OngoingRides";
import CompletedRides from "../Pages/RideManagement/CompletedRides";

// Vehicle Management
import AllVehicles from "../Pages/vehicleManagement/AllVehicles";
import ActiveVehicles from "../Pages/vehicleManagement/ActiveVehicles";
import OutOfServiceVehicles from "../Pages/vehicleManagement/OutOfService";

// Dispatcher
import LiveMap from "../Pages/dispatcher/LiveMap";
import ManualDispatch from "../Pages/dispatcher/manualDispatch/ManualDispatch.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // ✅ sidebar included
    children: [
      { index: true, element: <Login /> },
      // { path: "signup", element: <AdminSignup /> }, // your signup
      {
        path: "signup/:role", // bire signup
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Signup />
          </ProtectedRoute>
        ),
      },
      { path: "logout", element: <Logout /> },

      // ---- Admin routes ----
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/admins",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Admins />
          </ProtectedRoute>
        ),
      },
      // { path: "/AllUsers", element: <AllUsers /> }, // your alias
      {
        path: "admin/users/drivers",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Drivers />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users/passengers",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Passengers />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users/dispatchers",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dispatchers />
          </ProtectedRoute>
        ),
      },

      // Ride Management
      { path: "admin/rides", element: <AllRides /> },
      { path: "admin/ongoing", element: <OngoingRides /> },
      { path: "admin/completed", element: <CompletedRides /> },
      { path: "admin/cancelled", element: <CancelledRides /> },

      // ✅ Vehicle Management
      { path: "admin/vehicles", element: <AllVehicles /> },
      { path: "admin/vehicles/active", element: <ActiveVehicles /> },
      { path: "admin/vehicles/outofservice", element: <OutOfServiceVehicles /> },

      // Legacy aliases (optional, bire + yours)
      { path: "admins", element: <Admins /> },
      { path: "drivers", element: <Drivers /> },
      { path: "passengers", element: <Passengers /> },
      { path: "dispatchers", element: <Dispatchers /> },
      { path: "admin/Ongoing", element: <OngoingRides /> },
      { path: "admin/Completed", element: <CompletedRides /> },





      // ---- Dispatcher ----
  {
    path: "/dispatcher",
    element: (
      <ProtectedRoute allowedRoles={["admin", "dispatcher"]}>
        <DispatcherLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <LiveMap /> },
      { path: "livemap", element: <LiveMap /> },
      { path: "manualAssignment", element: <ManualDispatch /> },
    ],
  },
    ],
  },

  
]);

export default router;
