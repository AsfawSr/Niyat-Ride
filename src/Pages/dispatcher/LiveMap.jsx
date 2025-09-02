// // src/Pages/dispatcher/DispatcherPanel.jsx
// import React, { useState, useMemo } from "react";
// import {
//   MOCK_TRIPS,
//   MOCK_NEARBY_DRIVERS,
// } from "../../Components/dispatcher/TripsData";
// import {
//   TopBar,
//   SectionTitle,
//   Badge,
//   ActionsMenu,
// } from "../../Components/dispatcher/TripList";
// // Separate modals for each action
// import ReassignModal from "../../Components/dispatcher/modal/ReassignModal";
// import CancelModal from "../../Components/dispatcher/modal/CancelModal";
// import EmergencyModal from "../../Components/dispatcher/modal/EmergencyModal";
// import LiveMapView from "../../Components/dispatcher/LiveMapView";
// export default function LiveMap() {
//   const [trips, setTrips] = useState(MOCK_TRIPS);
//   const [focusedTripId, setFocusedTripId] = useState(trips[0]?.id ?? null);
//   const [query, setQuery] = useState("");
//   // Modal state for each action
//   const [reassignTrip, setReassignTrip] = useState(null);
//   const [cancelTrip, setCancelTrip] = useState(null);
//   const [emergencyTrip, setEmergencyTrip] = useState(null);
//   const filtered = useMemo(() => {
//     if (!query) return trips;
//     const q = query.toLowerCase();
//     return trips.filter(
//       (t) =>
//         t.id.toLowerCase().includes(q) ||
//         t.rider.toLowerCase().includes(q) ||
//         t.driver.toLowerCase().includes(q)
//     );
//   }, [trips, query]);
//   const focusedTrip = useMemo(
//     () => filtered.find((t) => t.id === focusedTripId) ?? filtered[0],
//     [filtered, focusedTripId]
//   );
//   const mapPoints = useMemo(() => {
//     if (!focusedTrip) return [];
//     return [focusedTrip.pickup, focusedTrip.dropoff, focusedTrip.driverPos];
//   }, [focusedTrip]);
//   // --- Action handlers ---
//   const performReassign = (driverId) => {
//     if (!reassignTrip) return;
//     const newDriver = MOCK_NEARBY_DRIVERS.find((d) => d.id === driverId);
//     setTrips((prev) =>
//       prev.map((t) =>
//         t.id === reassignTrip.id
//           ? { ...t, driver: newDriver?.name || t.driver }
//           : t
//       )
//     );
//     setReassignTrip(null);
//   };
//   const performCancel = () => {
//     if (!cancelTrip) return;
//     setTrips((prev) => prev.filter((t) => t.id !== cancelTrip.id));
//     setCancelTrip(null);
//   };
//   const performEmergency = (note) => {
//     if (!emergencyTrip) return;
//     console.log("EMERGENCY for", emergencyTrip.id, note);
//     setEmergencyTrip(null);
//   };
//   return (
//     <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 to-slate-900 text-gray-100 p-4 md:p-6">
//       {/* Top Bar */}
//       <TopBar count={trips.length} onSearch={setQuery} />

//       {/* Map + Active Trips */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
//         {/* Map */}
//         <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-900/60 shadow-xl overflow-hidden">
//           <div className="flex items-center justify-between p-3 border-b border-gray-800">
//             <SectionTitle>Live Map</SectionTitle>
//             {focusedTrip && (
//               <div className="flex items-center gap-3 text-sm text-gray-300">
//                 <span>
//                   Focused: <span className="font-medium">{focusedTrip.id}</span>
//                 </span>
//                 <Badge status={focusedTrip.status} />
//               </div>
//             )}
//           </div>
//           <LiveMapView
//             focusedTrip={focusedTrip}
//             mapPoints={mapPoints}
//             handleReassign={(trip) => setReassignTrip(trip)}
//             handleCancel={(trip) => setCancelTrip(trip)}
//             handleEmergency={(trip) => setEmergencyTrip(trip)}
//           />
//         </div>
//         {/* Active Trips List */}
//         <div className="rounded-2xl border border-gray-800 bg-gray-900/60 shadow-xl overflow-hidden">
//           <div className="flex items-center justify-between p-3 border-b border-gray-800">
//             <SectionTitle>Active Trips</SectionTitle>
//             <div className="text-xs text-gray-400">Click to focus</div>
//           </div>
//           <ul className="divide-y divide-gray-800 max-h-[450px] overflow-y-auto">
//             {filtered.map((trip) => (
//               <li
//                 key={trip.id}
//                 className={`p-3 hover:bg-gray-800/60 cursor-pointer ${
//                   focusedTrip?.id === trip.id ? "bg-gray-800/70" : ""
//                 }`}
//                 onClick={() => setFocusedTripId(trip.id)}
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="font-medium text-gray-100">
//                       {trip.rider}{" "}
//                       {/* <span className="text-gray-400">({trip.id})</span> */}
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       Driver: {trip.driver} · ETA {trip.etaMin}m
//                     </div>
//                   </div>
//                   <Badge status={trip.status} />
//                 </div>
//                 <div className="mt-2">
//                   <ActionsMenu
//                     trip={trip}
//                     onReassign={(t) => setReassignTrip(t)}
//                     onCancel={(t) => setCancelTrip(t)}
//                     onEmergency={(t) => setEmergencyTrip(t)}
//                   />
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Modals */}
//       {reassignTrip && (
//         <ReassignModal
//           open={!!reassignTrip}
//           trip={reassignTrip}
//           onClose={() => setReassignTrip(null)}
//           onReassign={performReassign}
//         />
//       )}
//       {cancelTrip && (
//         <CancelModal
//           open={!!cancelTrip}
//           trip={cancelTrip}
//           onClose={() => setCancelTrip(null)}
//           onCancel={performCancel}
//         />
//       )}
//       {emergencyTrip && (
//         <EmergencyModal
//           open={!!emergencyTrip}
//           trip={emergencyTrip}
//           onClose={() => setEmergencyTrip(null)}
//           onEmergency={performEmergency}
//         />
//       )}
//     </div>
//   );
// }
import React, { useState, useMemo, useEffect } from "react";
import {
  MOCK_TRIPS,
  MOCK_NEARBY_DRIVERS,
} from "../../Components/dispatcher/TripsData";
import {
  TopBar,
  SectionTitle,
  Badge,
  ActionsMenu,
} from "../../Components/dispatcher/TripList";
import ReassignModal from "../../Components/dispatcher/modal/ReassignModal";
import CancelModal from "../../Components/dispatcher/modal/CancelModal";
import EmergencyModal from "../../Components/dispatcher/modal/EmergencyModal";
import LiveMapView from "../../Components/dispatcher/LiveMapView";
export default function LiveMap() {
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [drivers, setDrivers] = useState(MOCK_NEARBY_DRIVERS);
  const [focusedTripId, setFocusedTripId] = useState(trips[0]?.id ?? null);
  const [query, setQuery] = useState("");
  // Modal states
  const [reassignTrip, setReassignTrip] = useState(null);
  const [cancelTrip, setCancelTrip] = useState(null);
  const [emergencyTrip, setEmergencyTrip] = useState(null);
  // ✅ WebSocket to update trips and drivers live
  useEffect(() => {
    const socket = new WebSocket("wss://your-backend.com/live-updates");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "trips_update") {
          setTrips(data.trips);
        }
        if (data.type === "drivers_update") {
          setDrivers(data.drivers);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message", err);
      }
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
    return () => socket.close();
  }, []);

  // ✅ Filtered trips
  const filtered = useMemo(() => {
    if (!query) return trips;
    const q = query.toLowerCase();
    return trips.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.rider.toLowerCase().includes(q) ||
        t.driver.toLowerCase().includes(q)
    );
  }, [trips, query]);

  const focusedTrip = useMemo(
    () => filtered.find((t) => t.id === focusedTripId) ?? filtered[0],
    [filtered, focusedTripId]
  );

  // --- Action handlers ---
  const performReassign = (driverId) => {
    if (!reassignTrip) return;
    const newDriver = drivers.find((d) => d.id === driverId);
    setTrips((prev) =>
      prev.map((t) =>
        t.id === reassignTrip.id
          ? { ...t, driver: newDriver?.name || t.driver }
          : t
      )
    );
    setReassignTrip(null);
  };

  const performCancel = () => {
    if (!cancelTrip) return;
    setTrips((prev) => prev.filter((t) => t.id !== cancelTrip.id));
    setCancelTrip(null);
  };

  const performEmergency = (note) => {
    if (!emergencyTrip) return;
    console.log("EMERGENCY for", emergencyTrip.id, note);
    setEmergencyTrip(null);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 to-slate-900 text-gray-100 p-4 md:p-6">
      {/* Top Bar */}
      <TopBar count={trips.length} onSearch={setQuery} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Map */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-800 bg-gray-900/60 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-800">
            <SectionTitle>Live Map</SectionTitle>
            {focusedTrip && (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span>
                  Focused: <span className="font-medium">{focusedTrip.id}</span>
                </span>
                <Badge status={focusedTrip.status} />
              </div>
            )}
          </div>
          <LiveMapView
            focusedTrip={focusedTrip}
            drivers={drivers} // ✅ Pass drivers for live map
            onReassign={(trip) => setReassignTrip(trip)}
            onCancel={(trip) => setCancelTrip(trip)}
            onEmergency={(trip) => setEmergencyTrip(trip)}
          />
        </div>

        {/* Active Trips List */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900/60 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b border-gray-800">
            <SectionTitle>Active Trips</SectionTitle>
            <div className="text-xs text-gray-400">Click to focus</div>
          </div>
          <ul className="divide-y divide-gray-800 max-h-[450px] overflow-y-auto">
            {filtered.map((trip) => (
              <li
                key={trip.id}
                className={`p-3 hover:bg-gray-800/60 cursor-pointer ${
                  focusedTrip?.id === trip.id ? "bg-gray-800/70" : ""
                }`}
                onClick={() => setFocusedTripId(trip.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-100">
                      {trip.rider}
                    </div>
                    <div className="text-xs text-gray-400">
                      Driver: {trip.driver} · ETA {trip.etaMin}m
                    </div>
                  </div>
                  <Badge status={trip.status} />
                </div>
                <div className="mt-2">
                  <ActionsMenu
                    trip={trip}
                    onReassign={(t) => setReassignTrip(t)}
                    onCancel={(t) => setCancelTrip(t)}
                    onEmergency={(t) => setEmergencyTrip(t)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modals */}
      {reassignTrip && (
        <ReassignModal
          open={!!reassignTrip}
          trip={reassignTrip}
          onClose={() => setReassignTrip(null)}
          onReassign={performReassign}
        />
      )}
      {cancelTrip && (
        <CancelModal
          open={!!cancelTrip}
          trip={cancelTrip}
          onClose={() => setCancelTrip(null)}
          onCancel={performCancel}
        />
      )}
      {emergencyTrip && (
        <EmergencyModal
          open={!!emergencyTrip}
          trip={emergencyTrip}
          onClose={() => setEmergencyTrip(null)}
          onEmergency={performEmergency}
        />
      )}
    </div>
  );
}
