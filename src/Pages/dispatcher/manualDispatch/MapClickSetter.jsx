import { useMapEvents } from "react-leaflet";

export default function MapClickSetter({ activeField, onSet }) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
        );
        const data = await res.json();
        const display =
          data?.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        onSet({ lat, lon: lng, display }, activeField);
      } catch {
        onSet(
          { lat, lon: lng, display: `${lat.toFixed(6)}, ${lng.toFixed(6)}` },
          activeField
        );
      }
    },
  });
  return null;
}
