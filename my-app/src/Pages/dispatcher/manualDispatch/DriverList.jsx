export default function DriverList({ formData, drivers, setFormData }) {
  return (
    <>
      <h2 className="text-lg font-semibold mt-6 mb-2">Available Drivers</h2>

      {/* Dropdown */}
      <div className="mb-4">
        <label className="block text-sm text-gray-700 mb-1">
          Assign Driver
        </label>
        <select
          name="selectedDriverId"
          className="w-full border rounded px-3 py-2"
          value={formData.selectedDriverId ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              selectedDriverId: Number(e.target.value), // convert to number if driverId is numeric
            }))
          }
        >
          <option value="">-- Select a driver --</option>
          {drivers?.map((d) => (
            <option key={d.driverId} value={d.driverId}>
              {d.firstName} {d.lastName} ({d.vehicle.vehicleType}) -{" "}
              {formData.pickupAddress ? d.distanceKm.toFixed(2) : "-"} km
            </option>
          ))}
        </select>
      </div>

      {/* Driver List */}
      {/* <ul className="space-y-2 max-h-48 overflow-y-auto">
        {drivers?.map((d) => (
          <li
            key={d.driverId}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {d.firstName} {d.lastName}
              </p>
              <p className="text-sm">
                {d.vehicle.vehicleModel} ({d.vehicle.vehicleType}) | {d.status}
              </p>
              <p className="text-xs text-gray-500">
                Distance:{" "}
                {formData.pickupAddress ? d.distanceKm.toFixed(2) : "-"} km •
                ETA: {d.estimatedArrivalMinutes} mins
              </p>
              <p className="text-xs text-gray-400">
                Plate: {d.vehicle.plateNumber}
              </p>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  selectedDriverId: d.driverId,
                }))
              }
            >
              Select
            </button>
          </li>
        ))}
      </ul> */}
    </>
  );
}
