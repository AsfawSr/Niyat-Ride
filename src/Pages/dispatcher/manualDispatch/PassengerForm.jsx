// import { vehicleTypes } from "./constants";

export default function PassengerForm({
  formData,
  setFormData,
  pickupSuggestions,
  dropoffSuggestions,
  onPickupInput,
  onDropoffInput,
  handleSelectSuggestion,
  setActiveField,
  vehicles,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Passenger Details</h2>

      {/* Phone */}

      {/* First & Last Name */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            required
            placeholder="enter first name"
            className="w-full border rounded px-3 py-2"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm  mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="enter last name"
            className="w-full border rounded px-3 py-2"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-sm  mb-1">Phone</label>
        <input
          type="tel"
          name="userPhone"
          className="w-full border rounded px-3 py-2"
          placeholder="enter phone of the passenger"
          value={formData.userPhone}
          onChange={handleChange}
        />
      </div>
      {/* City */}
      <div className="mb-3">
        <label className="block text-sm  mb-1">City</label>
        <select
          name="city"
          className="w-full border rounded px-3 py-2"
          value={formData.city}
          onChange={handleChange}
        >
          <option value="Mek'ele">Mek'ele</option>
          <option value="Addis Ababa">Addis Ababa</option>
          <option value="Adigrat">Adigrat</option>
        </select>
      </div>

      {/* Pickup Address */}
      <div className="mb-4 relative">
        <label className="block text-sm  mb-1">Pickup Address</label>
        <input
          type="text"
          name="pickupAddress"
          className="w-full border rounded px-3 py-2"
          placeholder="enter pickup address "
          value={formData.pickupAddress}
          onChange={onPickupInput}
          onFocus={() => setActiveField("pickup")}
        />
        {pickupSuggestions.length > 0 && (
          <ul className="absolute z-20 bg-white border w-full max-h-44 overflow-y-auto rounded shadow">
            {pickupSuggestions.map((item) => (
              <li
                key={item.place_id}
                className="p-2 hover:bg-gray-100 dark:text-gray-600  cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(item, "pickup")}
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Dropoff Address */}
      <div className="mb-4 relative">
        <label className="block text-sm  mb-1">Drop-off Address</label>
        <input
          type="text"
          name="dropoffAddress"
          className="w-full border rounded px-3 py-2 "
          placeholder="enter destination address"
          value={formData.dropoffAddress}
          onChange={onDropoffInput}
          onFocus={() => setActiveField("dropoff")}
        />
        {dropoffSuggestions.length > 0 && (
          <ul className="absolute z-20 bg-white border w-full max-h-44 overflow-y-auto rounded shadow">
            {dropoffSuggestions.map((item) => (
              <li
                key={item.place_id}
                className="p-2 hover:bg-gray-100  dark:text-gray-600 cursor-pointer text-sm "
                onClick={() => handleSelectSuggestion(item, "dropoff")}
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Vehicle Type */}
      <div className="mb-3">
        <label className="block text-sm  mb-1">Vehicle Type</label>
        <select
          name="vehicleType"
          className="w-full border rounded px-3 py-2 dark:text-gray-500"
          value={formData.vehicleTypeId}
          onChange={handleChange}
        >
          <option value="">Select vehicle</option>
          {vehicles.map((v) => (
            <option key={v.value} value={v.vehicleTypeId}>
              {v.vehicleTypeName}
            </option>
          ))}
        </select>
      </div>
      {/* Passenger Notes */}
      <div className="mb-4">
        <label className="block text-sm  mb-1">Passenger Notes</label>
        <textarea
          name="passengerNotes"
          className="w-full border rounded px-3 py-2"
          placeholder="enter notes to driver"
          rows={3}
          value={formData.passengerNotes}
          onChange={handleChange}
        />
      </div>
    </>
  );
}
