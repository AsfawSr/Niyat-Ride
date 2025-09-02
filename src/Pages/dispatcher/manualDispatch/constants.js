import L from "leaflet";

// --- Leaflet marker icon
export const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -28],
  shadowSize: [41, 41],
});
// For drivers (optional custom car icon)
export const carIcon = L.icon({
  iconUrl: "/icons/car.png", // must be in public/icons/
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
// Polyline color for routes
export const ROUTE_COLOR = "#007bff";
// --- Demo drivers
export const dummyDrivers = [
  {
    id: 1,
    name: "John Doe",
    vehicle: "Toyota Prius",
    status: "Available",
    location: [13.497, 39.48],
  },
  {
    id: 2,
    name: "Jane Smith",
    vehicle: "Honda Civic",
    status: "Available",
    location: [13.495, 39.477],
  },
  {
    id: 3,
    name: "Abel Tesfaye",
    vehicle: "Hyundai i10",
    status: "Busy",
    location: [13.498, 39.473],
  },
];

// Vehicle types
export const vehicleTypes = [
  { value: "sedan", label: "Sedan" },
  { value: "suv", label: "SUV" },
  { value: "hatchback", label: "Hatchback" },
  { value: "minivan", label: "Minivan" },
];
export const DEFAULT_CENTER = [13.4962, 39.4753]; // Mek'ele
