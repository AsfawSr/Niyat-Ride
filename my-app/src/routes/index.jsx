import { createBrowserRouter } from "react-router-dom";



// Layouts

import RootLayout from "../Pages/RootLayout";

import DispatcherLayout from "../layouts/DispatcherLayout";



// Auth & shared

import Login from "../Pages/Login";

import AdminSignup from "../Pages/AdminSignup";

import ProtectedRoute from "../Components/ProtectedRoute";



// Admin pages

import Dashboard from "../Pages/Dashboard";

import AllUsers from "../Pages/userManagement/AllUsers";

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

    element: <RootLayout />, // ✅ this layout contains the sidebar

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

      { path: "/AllUsers", element: <AllUsers /> },

      { path: "/drivers", element: <Drivers /> },

      { path: "/passengers", element: <Passengers /> },

      { path: "/dispatchers", element: <Dispatchers /> },



      // Ride Management

      { path: "admin/rides", element: <AllRides /> },

      { path: "admin/ongoing", element: <OngoingRides /> },

      { path: "admin/completed", element: <CompletedRides /> },

      { path: "admin/cancelled", element: <CancelledRides /> },



      // ✅ Vehicle Management

      { path: "admin/vehicles", element: <AllVehicles /> },

      { path: "admin/vehicles/active", element: <ActiveVehicles /> },

      { path: "admin/vehicles/outofservice", element: <OutOfServiceVehicles /> },

    ],

  },



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

]);



export default router;