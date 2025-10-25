import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { ActionsMenu } from "./TripList";
import SmartMapView from "../../Pages/dispatcher/manualDispatch/SmartMapView";
import {
  defaultIcon,
  carIcon,
} from "../../Pages/dispatcher/manualDispatch/constants";

// Fit map to valid points only
export function FitToMarkers({ points }) {
  const map = useMap();
  useEffect(() => {
    const validPoints = (points || []).filter(
      (p) => p && typeof p.lat === "number" && typeof p.lng === "number"
    );
    if (!validPoints.length) return;
    const bounds = L.latLngBounds(validPoints.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds.pad(0.3));
  }, [map, points]);
  return null;
}

function calculateBearing(from, to) {
  const lat1 = (from.lat * Math.PI) / 180;
  const lon1 = (from.lng * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const lon2 = (to.lng * Math.PI) / 180;
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function createRotatedIcon(baseIcon, angle) {
  return L.divIcon({
    html: `<div style="transform: rotate(${angle}deg); display:flex; align-items:center; justify-content:center;">
      ${baseIcon.options.html || ""}
    </div>`,
    className: baseIcon.options.className,
    iconSize: baseIcon.options.iconSize,
    iconAnchor: baseIcon.options.iconAnchor,
  });
}

function RoutingControl({ start, end }) {
  const map = useMap();
  const routingRef = useRef(null);

  useEffect(() => {
    if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng)
      return;

    if (routingRef.current) map.removeControl(routingRef.current);

    routingRef.current = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      show: false,
      routeWhileDragging: false,
      createMarker: () => null, // does not block popups
      lineOptions: { styles: [{ color: "#3b82f6", weight: 4 }] },
    }).addTo(map);

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
        routingRef.current = null;
      }
    };
  }, [map, start, end]);

  return null;
}

export default function LiveMapView({
  mapCenter,
  focusedTrip,
  mapPoints = [],
  pickupLocation,
  dropoffLocation,
  drivers = [],
  onReassign,
  onCancel,
  onEmergency,
}) {
  const driverMarkersRef = useRef({});
  const previousPositionsRef = useRef({});
  const [driverPaths, setDriverPaths] = useState({}); // store history for each driver

  // Update driver icons and positions + record path
  useEffect(() => {
    const newPaths = { ...driverPaths };

    drivers.forEach((driver) => {
      const marker = driverMarkersRef.current[driver.id];
      if (!marker) return;

      const prev = previousPositionsRef.current[driver.id];
      const newPos = { lat: driver.location.lat, lng: driver.location.lng };

      // Update bearing
      if (prev) {
        const bearing = calculateBearing(prev, newPos);
        marker.setIcon(createRotatedIcon(carIcon, bearing));
      }

      marker.setLatLng([newPos.lat, newPos.lng]);
      previousPositionsRef.current[driver.id] = newPos;

      // Record path
      if (!newPaths[driver.id]) newPaths[driver.id] = [];
      newPaths[driver.id].push([newPos.lat, newPos.lng]);
    });

    setDriverPaths(newPaths);
  }, [drivers]);

  const pointsToFit =
    focusedTrip && focusedTrip.pickup && focusedTrip.dropoff
      ? [
          ...(focusedTrip.driverPos ? [focusedTrip.driverPos] : []),
          focusedTrip.pickup,
          focusedTrip.dropoff,
        ]
      : drivers.map((d) => d.location);

  const allPoints = [
    ...(pickupLocation ? [pickupLocation] : []),
    ...(dropoffLocation ? [dropoffLocation] : []),
    ...(drivers.map((d) => d.location) || []),
    ...(focusedTrip?.driverPos ? [focusedTrip.driverPos] : []),
  ];

  return (
    <div className="w-full h-full min-h-[480px] rounded overflow-hidden">
      <MapContainer
        center={mapCenter || [9.03, 38.74]}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />

        <SmartMapView pickup={pickupLocation} dropoff={dropoffLocation} />

        {focusedTrip?.pickup && focusedTrip?.dropoff && (
          <RoutingControl
            start={focusedTrip.pickup}
            end={focusedTrip.dropoff}
          />
        )}

        {/* Pickup & Dropoff */}
        {focusedTrip?.pickup && (
          <Marker
            position={[focusedTrip.pickup.lat, focusedTrip.pickup.lng]}
            icon={defaultIcon}
          >
            <Popup>Pickup: {focusedTrip.rider}</Popup>
          </Marker>
        )}
        {focusedTrip?.dropoff && (
          <Marker
            position={[focusedTrip.dropoff.lat, focusedTrip.dropoff.lng]}
            icon={defaultIcon}
          >
            <Popup>Dropoff: {focusedTrip.rider}</Popup>
          </Marker>
        )}

        {/* Focused Trip Driver */}
        {focusedTrip?.driverPos && (
          <Marker
            position={[focusedTrip.driverPos.lat, focusedTrip.driverPos.lng]}
            icon={carIcon}
            ref={(el) => {
              if (el) driverMarkersRef.current[focusedTrip.driverId] = el;
            }}
          >
            <Popup>
              <div className="space-y-1 text-sm">
                <div className="font-semibold">{focusedTrip.driver}</div>
                <div>Trip: {focusedTrip.id}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 border-green-300">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                    {focusedTrip.status}
                  </span>
                  <span>ETA {focusedTrip.etaMin}m</span>
                </div>
                <div className="pt-2 border-t border-gray-200/10">
                  <ActionsMenu
                    onReassign={() => onReassign(focusedTrip)}
                    onCancel={() => onCancel(focusedTrip)}
                    onEmergency={() => onEmergency(focusedTrip)}
                  />
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Other Drivers + paths */}
        {drivers.map((d) =>
          d.location && typeof d.location.lat === "number" ? (
            <React.Fragment key={d.id}>
              <Marker
                position={[d.location.lat, d.location.lng]}
                icon={carIcon}
                ref={(el) => {
                  if (el) driverMarkersRef.current[d.id] = el;
                }}
              >
                <Popup>
                  {d.name} | {d.status}
                </Popup>
              </Marker>
              {driverPaths[d.id] && driverPaths[d.id].length > 1 && (
                <Polyline
                  positions={driverPaths[d.id]}
                  color="blue"
                  weight={3}
                />
              )}
            </React.Fragment>
          ) : null
        )}

        <FitToMarkers points={pointsToFit.length ? pointsToFit : allPoints} />
      </MapContainer>
    </div>
  );
}
