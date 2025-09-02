// src/Pages/dispatcher/TripsData.js

export const MOCK_TRIPS = [
  { id: "#1234", rider: "John D.", driver: "Michael J.", status: "ON_TRIP", pickup: { lat: 8.9806, lng: 38.7578, label: "Bole" }, dropoff: { lat: 9.0054, lng: 38.7636, label: "CMC" }, driverPos: { lat: 8.992, lng: 38.7608 }, etaMin: 12 },
  { id: "#1235", rider: "Sarah T.", driver: "Alex P.", status: "EN_ROUTE_TO_PICKUP", pickup: { lat: 8.995, lng: 38.78, label: "Kazanchis" }, dropoff: { lat: 9.018, lng: 38.78, label: "Megenagna" }, driverPos: { lat: 8.99, lng: 38.772 }, etaMin: 6 },
  { id: "#1236", rider: "David S.", driver: "Maria L.", status: "PICKED_UP", pickup: { lat: 9.01, lng: 38.77, label: "4 Killo" }, dropoff: { lat: 9.04, lng: 38.75, label: "Sar Bet" }, driverPos: { lat: 9.023, lng: 38.761 }, etaMin: 18 },
  { id: "#1237", rider: "Linda K.", driver: "Paul R.", status: "ON_TRIP", pickup: { lat: 8.975, lng: 38.74, label: "Arat Kilo" }, dropoff: { lat: 9.02, lng: 38.765, label: "Meskel Square" }, driverPos: { lat: 9.0, lng: 38.755 }, etaMin: 14 },
  { id: "#1238", rider: "George W.", driver: "Nadia T.", status: "EN_ROUTE_TO_PICKUP", pickup: { lat: 8.99, lng: 38.77, label: "Bole Road" }, dropoff: { lat: 9.01, lng: 38.78, label: "Kazanchis" }, driverPos: { lat: 8.992, lng: 38.772 }, etaMin: 5 },
  { id: "#1239", rider: "Emma F.", driver: "Chris H.", status: "PICKED_UP", pickup: { lat: 9.005, lng: 38.75, label: "Gurd Shola" }, dropoff: { lat: 9.02, lng: 38.77, label: "Cazanchis" }, driverPos: { lat: 9.01, lng: 38.755 }, etaMin: 20 },
  { id: "#1240", rider: "Robert L.", driver: "Helen M.", status: "ON_TRIP", pickup: { lat: 8.985, lng: 38.765, label: "Bole Medhane Alem" }, dropoff: { lat: 9.01, lng: 38.78, label: "Megenagna" }, driverPos: { lat: 8.99, lng: 38.77 }, etaMin: 11 },
  { id: "#1241", rider: "Olivia S.", driver: "James B.", status: "EN_ROUTE_TO_PICKUP", pickup: { lat: 8.98, lng: 38.76, label: "Bole Plaza" }, dropoff: { lat: 9.0, lng: 38.77, label: "Kazanchis" }, driverPos: { lat: 8.985, lng: 38.762 }, etaMin: 7 },
  { id: "#1242", rider: "William G.", driver: "Sophia N.", status: "PICKED_UP", pickup: { lat: 9.015, lng: 38.755, label: "Mexico" }, dropoff: { lat: 9.04, lng: 38.76, label: "CMC" }, driverPos: { lat: 9.02, lng: 38.76 }, etaMin: 15 },
  { id: "#1243", rider: "Sophia R.", driver: "Daniel K.", status: "ON_TRIP", pickup: { lat: 8.99, lng: 38.745, label: "Kazanchis 2" }, dropoff: { lat: 9.005, lng: 38.755, label: "Bole" }, driverPos: { lat: 8.998, lng: 38.75 }, etaMin: 9 },
  { id: "#1244", rider: "James L.", driver: "Maya C.", status: "EN_ROUTE_TO_PICKUP", pickup: { lat: 8.995, lng: 38.77, label: "Bole Bus Station" }, dropoff: { lat: 9.02, lng: 38.78, label: "Meskel Square" }, driverPos: { lat: 8.997, lng: 38.772 }, etaMin: 6 },
  { id: "#1245", rider: "Isabella H.", driver: "Ethan S.", status: "PICKED_UP", pickup: { lat: 9.0, lng: 38.76, label: "Bole Subcity" }, dropoff: { lat: 9.025, lng: 38.77, label: "CMC" }, driverPos: { lat: 9.01, lng: 38.762 }, etaMin: 12 },
  { id: "#1246", rider: "Benjamin T.", driver: "Lily A.", status: "ON_TRIP", pickup: { lat: 8.99, lng: 38.755, label: "Arat Kilo" }, dropoff: { lat: 9.01, lng: 38.77, label: "Meskel Square" }, driverPos: { lat: 9.0, lng: 38.765 }, etaMin: 13 },
  { id: "#1247", rider: "Mia P.", driver: "David R.", status: "EN_ROUTE_TO_PICKUP", pickup: { lat: 9.005, lng: 38.75, label: "Kazanchis" }, dropoff: { lat: 9.03, lng: 38.77, label: "CMC" }, driverPos: { lat: 9.01, lng: 38.755 }, etaMin: 8 },
  { id: "#1248", rider: "Noah J.", driver: "Grace K.", status: "PICKED_UP", pickup: { lat: 9.01, lng: 38.76, label: "Bole Medhane Alem" }, dropoff: { lat: 9.04, lng: 38.78, label: "Meskel Square" }, driverPos: { lat: 9.02, lng: 38.765 }, etaMin: 17 },
];
export const MOCK_NEARBY_DRIVERS = [
  { id: "D-2001", name: "Selam A.", lat: 8.994, lng: 38.766, distanceKm: 0.9 },
  { id: "D-2002", name: "Robel G.", lat: 8.999, lng: 38.772, distanceKm: 1.3 },
  { id: "D-2003", name: "Hanna K.", lat: 9.003, lng: 38.768, distanceKm: 1.8 },
  { id: "D-2004", name: "Mekdes T.", lat: 8.998, lng: 38.76, distanceKm: 2.0 },
  { id: "D-2005", name: "Daniel B.", lat: 9.002, lng: 38.772, distanceKm: 2.3 },
];
