import { useMemo, useRef, useState, useEffect } from "react";
import PassengerForm from "./PassengerForm";
import DriverList from "./DriverList";
import MapView from "./MapView";
import Sidebar from "../../../Components/Sidebar";
import api from "../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "../../../store/vehiclesDispatcherSlice";

export default function ManualDispatch() {
  const { userId } = useSelector((state) => state.auth);
  const { vehicles, status } = useSelector((state) => state.vehiclesDispacher);

  const [nearbyDrivers, setNearbyDrivers] = useState(vehicles); // for response data
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (status !== "success") {
      dispatch(fetchVehicles());
    }
  }, [status, dispatch]);

  const [formData, setFormData] = useState({
    userPhone: "",
    firstName: "",
    lastName: "",
    city: "Mek'ele",
    pickupAddress: "",
    dropoffAddress: "",
    vehicleTypeId: "",
    passengerNotes: "",
    driverId: "",
  });

  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [activeField, setActiveField] = useState("pickup");

  const pickupDebounceRef = useRef(null);
  const dropoffDebounceRef = useRef(null);

  // ✅ Fetch Suggestions from Nominatim
  const fetchSuggestions = async (query, type, cityBias) => {
    if (!query || query.trim().length < 2) {
      if (type === "pickup") setPickupSuggestions([]);
      else setDropoffSuggestions([]);
      return;
    }
    const q = cityBias ? `${query}, ${cityBias}` : query;
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&accept-language=en&q=${encodeURIComponent(
      q
    )}`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "DispatcherDemo/1.0" },
      });
      const data = await res.json();
      if (type === "pickup") setPickupSuggestions(data);
      else setDropoffSuggestions(data);
    } catch {
      if (type === "pickup") setPickupSuggestions([]);
      else setDropoffSuggestions([]);
    }
  };

  const onPickupInput = (e) => {
    setFormData((prev) => ({ ...prev, pickupAddress: e.target.value }));
    setActiveField("pickup");
    if (pickupDebounceRef.current) clearTimeout(pickupDebounceRef.current);
    pickupDebounceRef.current = setTimeout(
      () => fetchSuggestions(e.target.value, "pickup", formData.city),
      300
    );
  };

  const onDropoffInput = (e) => {
    setFormData((prev) => ({ ...prev, dropoffAddress: e.target.value }));
    setActiveField("dropoff");
    if (dropoffDebounceRef.current) clearTimeout(dropoffDebounceRef.current);
    dropoffDebounceRef.current = setTimeout(
      () => fetchSuggestions(e.target.value, "dropoff", formData.city),
      300
    );
  };

  const handleSelectSuggestion = (item, type) => {
    const lat = parseFloat(item.lat),
      lon = parseFloat(item.lon),
      address = item.display_name;
    if (type === "pickup") {
      setPickupLocation({ lat, lng: lon });
      setFormData((prev) => ({ ...prev, pickupAddress: address }));
      setPickupSuggestions([]);
      setActiveField("dropoff");
    } else {
      setDropoffLocation({ lat, lng: lon });
      setFormData((prev) => ({ ...prev, dropoffAddress: address }));
      setDropoffSuggestions([]);
    }
  };

  const handleMapSet = ({ lat, lon, display }, type) => {
    if (type === "pickup") {
      setPickupLocation({ lat, lng: lon });
      setFormData((prev) => ({ ...prev, pickupAddress: display }));
    } else {
      setDropoffLocation({ lat, lng: lon });
      setFormData((prev) => ({ ...prev, dropoffAddress: display }));
    }
  };

  // ✅ Step 1: Request Ride (get nearby drivers)
  const handleRequestRide = async () => {
    if (!pickupLocation || !dropoffLocation) {
      alert("Please select both pickup and dropoff locations!");
      return;
    }

    const payload = {
      dispatcherId: userId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerPhoneNumber: formData.userPhone,
      pickupLocation: {
        latitude: pickupLocation.lat,
        longitude: pickupLocation.lng,
        address: formData.pickupAddress,
      },
      dropoffLocation: {
        latitude: dropoffLocation.lat,
        longitude: dropoffLocation.lng,
        address: formData.dropoffAddress,
      },
      vehicleTypeId: formData.vehicleTypeId || null,
      notes: formData.passengerNotes || "",
    };

    try {
      const response = await api.post("/api/dispatcher/rides", payload, {
        withCredentials: true,
      });
      setNearbyDrivers(response.data.nearbyDrivers);
      alert("Nearby drivers found! Select a driver to assign.");
    } catch (error) {
      console.error("Error requesting ride:", error);
      alert("Failed to request ride. Please try again.");
    }
  };

  // ✅ Step 2: Assign Ride
  const handleAssignRide = async () => {
    if (!selectedDriverId) {
      alert("Please select a driver first!");
      return;
    }

    const payload = {
      dispatcherId: userId,
      driverId: selectedDriverId,
      rideId: "replace_with_actual_ride_id_from_response", // must get from step 1 response
      assignedAt: new Date().toISOString(),
    };

    try {
      const response = await api.put("/api/dispatcher/rides/assign", payload);
      alert("Ride assigned successfully!");
      console.log("Assigned ride:", response.data);
    } catch (error) {
      console.error("Error assigning ride:", error);
      alert("Failed to assign ride. Please try again.");
    }
  };

  const mapCenter = useMemo(
    () => pickupLocation || dropoffLocation || DEFAULT_CENTER,
    [pickupLocation, dropoffLocation]
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Manual Dispatch</h1>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[86vh]">
          {/* LEFT: Form + Drivers */}
          <div className="dark:text-white shadow rounded-lg p-6 overflow-y-auto">
            <PassengerForm
              formData={formData}
              setFormData={setFormData}
              pickupSuggestions={pickupSuggestions}
              dropoffSuggestions={dropoffSuggestions}
              onPickupInput={onPickupInput}
              onDropoffInput={onDropoffInput}
              handleSelectSuggestion={handleSelectSuggestion}
              setActiveField={setActiveField}
              vehicles={vehicles}
              status={status}
            />
            <button
              onClick={handleRequestRide}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
            >
              Request Ride
            </button>

            <DriverList
              formData={formData}
              setFormData={setFormData}
              drivers={nearbyDrivers}
              selectedDriverId={selectedDriverId}
              setSelectedDriverId={setSelectedDriverId}
            />

            <div className="flex gap-2 mt-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={handleAssignRide}
              >
                Assign Ride
              </button>
            </div>
          </div>

          {/* RIGHT: Map */}
          <MapView
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            drivers={nearbyDrivers}
            activeField={activeField}
            handleMapSet={handleMapSet}
            mapCenter={mapCenter}
          />
        </div>
      </main>
    </div>
  );
}
