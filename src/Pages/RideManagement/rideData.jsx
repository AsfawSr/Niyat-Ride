// src/Pages/RideManagement/rideData.js

const passengers = ["Alice", "Bob", "Clara", "Daniel", "Eden", "Fikre", "Girma", "Hanna", "Ibrahim", "Jalen"];
const drivers = ["John", "Michael", "Sophia", "Sara", "Kebede", "Liya", "Robel", "Nati", "Martha", "Samuel"];
const statuses = ["Completed", "Ongoing", "Cancelled"];

export function generateDummyRides(count = 120) {
  const rides = [];
  for (let i = 1; i <= count; i++) {
    const p = passengers[i % passengers.length];
    const d = drivers[(i * 3) % drivers.length];
    const st = statuses[i % statuses.length];
    const day = (i % 28) + 1;
    rides.push({
      id: `R${1000 + i}`,
      passenger: p,
      driver: d,
      status: st,
      date: `2025-08-${String(day).padStart(2, "0")}`,
      fare: st === "Cancelled" ? "$0.00" : `$${(8 + (i % 12) + Math.random()).toFixed(2)}`,
      pickup: "Bole, Addis Ababa",
      dropoff: "Arat Kilo, Addis Ababa",
    });
  }
  return rides;
}
