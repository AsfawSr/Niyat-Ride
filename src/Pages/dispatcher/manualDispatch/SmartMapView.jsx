import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
export default function SmartMapView({ pickup, dropoff }) {
  const map = useMap();
  useEffect(() => {
    if (pickup && dropoff) {
      const group = L.featureGroup([L.marker(pickup), L.marker(dropoff)]);
      map.fitBounds(group.getBounds().pad(0.25));
    } else if (pickup) {
      map.flyTo(pickup, 16);
    } else if (dropoff) {
      map.flyTo(dropoff, 16);
    }
  }, [pickup, dropoff, map]);

  return null;
}
