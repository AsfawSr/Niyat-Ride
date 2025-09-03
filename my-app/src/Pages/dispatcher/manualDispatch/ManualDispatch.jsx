import { useMemo, useEffect, useRef, useState } from "react";
import PassengerForm from "./PassengerForm";
import DriverList from "./DriverList";
import MapView from "./MapView";
import { dummyDrivers, DEFAULT_CENTER } from "./constants";
import L from "leaflet";
import Sidebar from "../../../Components/Sidebar";
import api from "../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { fetchVehicles } from "../../../store/vehiclesDispatcherSlice";
const initialState = {
  userPhone: "",
  firstName: "",
  lastName: "",
  city: "Mek'ele",
  pickupAddress: "",
  dropoffAddress: "",
  vehicleTypeId: "",
  passengerNotes: "",
  driverId: "",
};
export default function ManualDispatch() {
  const { userId } = useSelector((state) => state.auth);
  const { vehicles, status } = useSelector((state) => state.vehiclesDispacher);
  const [nearDrivers, setNearDrivers] = useState(vehicles);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status != "succes") {
      dispatch(fetchVehicles());
    }
  });
  const [formData, setFormData] = useState(initialState);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
  const [activeField, setActiveField] = useState("pickup");
  // const [drivers] = useState(dummyDrivers);
  const pickupDebounceRef = useRef(null);
  const dropoffDebounceRef = useRef(null);
  // Fetch Suggestions
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
      setPickupLocation([lat, lon]);
      setFormData((prev) => ({ ...prev, pickupAddress: address }));
      setPickupSuggestions([]);
      setActiveField("dropoff");
    } else {
      setDropoffLocation([lat, lon]);
      setFormData((prev) => ({ ...prev, dropoffAddress: address }));
      setDropoffSuggestions([]);
    }
  };
  const handleMapSet = ({ lat, lon, display }, type) => {
    console.log("==", display, lat, lon, type);
    if (type === "pickup") {
      setPickupLocation([lat, lon]);
      setFormData((prev) => ({ ...prev, pickupAddress: display }));
    } else {
      setDropoffLocation([lat, lon]);
      setFormData((prev) => ({ ...prev, dropoffAddress: display }));
    }
  };
  const calculateDistance = (loc) => {
    if (!pickupLocation || !loc) return "-";
    const point1 = L.latLng(pickupLocation[0], pickupLocation[1]);
    const point2 = L.latLng(loc[0], loc[1]);
    return `${(point1.distanceTo(point2) / 1000).toFixed(2)} km`;
  };
  const handleRideRequest = async () => {
    if (!pickupLocation || !dropoffLocation) {
      alert("Please select both pickup and dropoff locations!");
      return;
    }

    // Construct the payload according to DispatcherRideRequestDTO
    const payload = {
      dispatcherId: userId, //  actual dispatcherId if you have it
      customerInfo: {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.userPhone,
      },
      pickupLocation: {
        latitude: pickupLocation.lat,
        longitude: pickupLocation.lng,
        address: formData.pickupAddress,
        notes: formData.passengerNotes || "",
      },
      dropoffLocation: {
        latitude: dropoffLocation.lat,
        longitude: dropoffLocation.lng,
        address: formData.dropoffAddress,
      },
      vehicleTypePreference: formData.vehicleTypeId || undefined,
      notes: formData.passengerNotes || undefined,
    };
    try {
      const response = await api.post("/api/dispatcher/rides", payload, {
        withCredentials: true, // if your backend uses cookies for auth
      });
      // Show confirmation alert
      const date = new Date();
      alert(`Ride assigned successfully!\n\nPassenger: ${formData.firstName} ${
        formData.lastName
      } (${formData.userPhone})
Pickup: ${pickupLocation.lat}, ${pickupLocation.lng}
Dropoff: ${dropoffLocation.lat}, ${dropoffLocation.lng}
Driver: ${formData.selectedDriverId || "-"}
Vehicle Type: ${formData.vehicleType || "-"}
Date: ${date.toLocaleString()}
Notes: ${formData.passengerNotes || "-"}`);
      // Reset the form
      setFormData(initialState);
      setPickupLocation(null);
      setDropoffLocation(null);
      setPickupSuggestions([]);
      setDropoffSuggestions([]);
      setActiveField("pickup"); // reset focus to pickup field
    } catch (error) {
      alert("Failed to assign ride. Please try again.");
    }
  };
  const handleAssignRide = async () => {
    const payload = {
      date: new Date(),
      driverId: nea,
    };
    try {
      const response = await api.post("/api/dispatcher/rides", payload, {
        withCredentials: true, // if your backend uses cookies for auth
      });
    } catch (error) {}
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
          <div className=" dark:text-white shadow rounded-lg p-6 overflow-y-auto">
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
            <button onClick={handleRideRequest}>request Ride</button>
            <DriverList
              drivers={nearDrivers}
              formData={formData}
              setFormData={setFormData}
            />
            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => alert("Fare estimation coming soon!")}
              >
                Get Fare Estimate
              </button>
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
            drivers={dummyDrivers}
            activeField={activeField}
            handleMapSet={handleMapSet}
            mapCenter={mapCenter}
          />
        </div>
      </main>
    </div>
  );
}
