export default function DriverList({
  vehicles,
  formData,
  setFormData,
  calculateDistance,
}) {
  // Calculate distance for each driver
  const vehiclesWithDistance = vehicles?.map((v) => ({
    ...v,
    distance:
      formData.pickupAddress && calculateDistance(v.location)
        ? parseFloat(calculateDistance(v.location))
        : Infinity, // Infinity if pickupAddress is empty
  }));
  // Sort drivers by distance
  const sortedVehicle = [...vehiclesWithDistance].sort(
    (a, b) => a.distance - b.distance
  );
  // Closest driver only if pickupAddress is filled
  const closestDriverId =
    formData.pickupAddress && sortedVehicle.length > 0
      ? sortedVehicle[0].id
      : null;
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
          value={formData.driverId ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              selectedDriverID: e.target.value,
            }))
          }
        >
          <option value="">-- Select a driver --</option>
          {sortedVehicle?.map((v) => (
            <option key={v.driverId} value={v.driverId}>
              {d.driverName} ({v.vehicleTypeName}) -{" "}
              {formData.pickupAddress ? d.distance.toFixed(2) : "-"}
              {formData.pickupAddress && d.id === closestDriverId
                ? " (Closest)"
                : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Driver List */}
      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {sortedVehicle?.map((v) => (
          <li
            key={v.id}
            className={`border p-2 rounded flex justify-between items-center ${
              formData.pickupAddress && v.id === closestDriverId
                ? "border-green-500 bg-green-50"
                : ""
            }`}
          >
            <div>
              <p className="font-semibold">
                {v.driverName}{" "}
                {formData.pickupAddress && v.driverId === closestDriverId && (
                  <span className="text-green-600 text-xs font-medium">
                    (Closest)
                  </span>
                )}
              </p>
              <p className="text-sm">
                {v.vehicleTypeName} | {v.status}
              </p>
              <p className="text-xs text-gray-500">
                Distance: {formData.pickupAddress ? v.distance.toFixed(2) : "-"}
                km
              </p>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  selectedDriverId: v.driverId,
                }))
              }
            >
              Select
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
