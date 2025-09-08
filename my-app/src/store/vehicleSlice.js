import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vehicles: [
    {
      id: "1",
      image: "/cars/car1.png", // ✅ served from public/cars
      name: "Toyota Corolla",
      pricePerKm: 12,
      description: "Compact sedan - fuel efficient",
      status: "active",
    },
    {
      id: "2",
      image: "/cars/car2.png",
      name: "Hyundai Tucson",
      pricePerKm: 18,
      description: "SUV with comfort seating",
      status: "outofservice",
    },
    {
      id: "3",
      image: "/cars/car3.svg",
      name: "Mercedes E-Class",
      pricePerKm: 30,
      description: "Luxury sedan",
      status: "active",
    },
  ],
};

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState,
  reducers: {
    addVehicle: (state, action) => {
      state.vehicles.push(action.payload);
    },
    updateVehicle: (state, action) => {
      const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.vehicles[index] = action.payload;
      }
    },
    deleteVehicle: (state, action) => {
      state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
    },
  },
});

export const { addVehicle, updateVehicle, deleteVehicle } =
  vehiclesSlice.actions;
export default vehiclesSlice.reducer;
