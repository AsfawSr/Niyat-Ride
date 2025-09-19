// src/Pages/vehicleManagement/ActiveVehicles.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import VehicleTable from "../../Components/VehicleTable";
import { fetchVehicleTypes } from "../../store/vehicleSlice";

const ActiveVehicles = () => {
  const dispatch = useDispatch();

  // fetch vehicles (or vehicle types) on mount
  useEffect(() => {
    dispatch(fetchVehicleTypes());
  }, [dispatch]);

  // guard in case state.vehicles is undefined for any reason
  const vehiclesState = useSelector((state) => state.vehicles || {});
  const vehicles = vehiclesState.list || [];
  const { status, error } = vehiclesState;

  // filter active only
  const activeVehicles = vehicles.filter((v) => v.isActive === true);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Active Vehicles</h1>

          {status === "loading" && <p>Loading...</p>}
          {status === "failed" && <p className="text-red-500">Error: {error}</p>}

          <VehicleTable vehicles={activeVehicles} />
        </div>
      </div>
    </div>
  );
};

export default ActiveVehicles;
