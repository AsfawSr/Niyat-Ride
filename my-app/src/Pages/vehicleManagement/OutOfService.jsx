import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import VehicleTable from "../../Components/VehicleTable";

const OutOfService = () => {
  const vehicles = useSelector((state) =>
    state.vehicles.vehicles.filter((v) => v.status === "outofservice")
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Out of Service Vehicles</h1>
          <VehicleTable vehicles={vehicles} />
        </div>
      </div>
    </div>
  );
};

export default OutOfService;
