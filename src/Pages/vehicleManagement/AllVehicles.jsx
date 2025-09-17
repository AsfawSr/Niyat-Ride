import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import VehicleTable from "../../Components/VehicleTable";
import { addVehicle } from "../../store/vehicleSlice"; // ✅ make sure it's vehiclesSlice.js

const AllVehicles = () => {
  const dispatch = useDispatch();
  const vehicles = useSelector((state) => state.vehicles.vehicles);

  // form state
  const [form, setForm] = useState({
    image: "",
    name: "",
    pricePerKm: "",
    description: "",
    status: "active",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ helper to convert image -> Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result); // base64 string
      reader.onerror = (err) => reject(err);
    });

  // ✅ handle file upload (car image)
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await toBase64(file);
      setForm({ ...form, image: base64 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newVehicle = {
      id: Date.now().toString(), // simple unique ID
      ...form,
      pricePerKm: Number(form.pricePerKm),
    };

    dispatch(addVehicle(newVehicle));

    // reset form
    setForm({
      image: "",
      name: "",
      pricePerKm: "",
      description: "",
      status: "active",
    });
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">All Vehicles</h1>

          {/* Add Vehicle Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Image upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded px-3 py-2"
              required
            />
            {form.image && (
              <img
                src={form.image}
                alt="preview"
                className="w-24 h-16 object-cover rounded mb-2"
              />
            )}

            <input
              type="text"
              name="name"
              placeholder="Car Name"
              value={form.name}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              name="pricePerKm"
              placeholder="Price per km"
              value={form.pricePerKm}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border rounded px-3 py-2 md:col-span-2 lg:col-span-3"
            />
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="outofservice">Out of Service</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Vehicle
            </button>
          </form>

          {/* Vehicle Table */}
          <VehicleTable vehicles={vehicles} />
        </div>
      </div>
    </div>
  );
};

export default AllVehicles;
