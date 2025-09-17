// src/Pages/vehicleManagement/OutOfService.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import VehicleTable from "../../Components/VehicleTable";
import { fetchVehicleTypes } from "../../store/vehicleSlice";

const OutOfService = () => {
  const dispatch = useDispatch();

  // ✅ fetch vehicles on mount (in case not already loaded)
  useEffect(() => {
    dispatch(fetchVehicleTypes());
  }, [dispatch]);

  const { list: vehicles = [], status, error } = useSelector(
    (state) => state.vehicles
  );

  // ✅ filter only vehicles where isActive === false
  const outOfServiceVehicles = vehicles.filter((v) => v.isActive === false);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Out of Service Vehicles</h1>

          {status === "loading" && <p>Loading...</p>}
          {status === "failed" && (
            <p className="text-red-500">Error: {error}</p>
          )}

          <VehicleTable vehicles={outOfServiceVehicles} />
        </div>
      </div>
    </div>
  );
};

export default OutOfService;
