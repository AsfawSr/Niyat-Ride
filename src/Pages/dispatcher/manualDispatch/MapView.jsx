import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import SmartMapView from "./SmartMapView";
import MapClickSetter from "./MapClickSetter";
import { defaultIcon } from "./constants";
export default function MapView({
  pickupLocation,
  dropoffLocation,
  drivers,
  activeField,
  handleMapSet,
  mapCenter,
}) {
  return (
    <div className="bg-white shadow rounded-lg p-2 xl:col-span-2">
      <div className="w-full h-full min-h-[480px] xl:h-[calc(86vh-1rem)] rounded overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom
          className="w-full h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap"
          />
          <MapClickSetter activeField={activeField} onSet={handleMapSet} />
          <SmartMapView pickup={pickupLocation} dropoff={dropoffLocation} />
          {pickupLocation && (
            <Marker position={pickupLocation} icon={defaultIcon}>
              <Popup>Pickup</Popup>
            </Marker>
          )}
          {dropoffLocation && (
            <Marker position={dropoffLocation} icon={defaultIcon}>
              <Popup>Drop-off</Popup>
            </Marker>
          )}

          {drivers.map((d) => (
            <Marker key={d.id} position={d.location} icon={defaultIcon}>
              <Popup>
                {d.name} | {d.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
