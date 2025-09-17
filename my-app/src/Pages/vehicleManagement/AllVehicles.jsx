// src/Pages/vehicleManagement/AllVehicles.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import VehicleTable from "../../Components/VehicleTable";
import {
  fetchVehicleTypes,
  createVehicleType,
} from "../../store/vehicleSlice"; // adjust path if needed

const AllVehicles = () => {
  const dispatch = useDispatch();
  const { list: vehicles = [], status, error } = useSelector(
    (state) => state.vehicles || { list: [], status: "idle", error: null }
  );

  // form state
  const [form, setForm] = useState({
    file: null, // ✅ store File object instead of Base64
    name: "",
    pricePerKm: "",
    description: "",
    isActive: true,
  });
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(""); // for showing preview only

  useEffect(() => {
    dispatch(fetchVehicleTypes());
  }, [dispatch]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((f) => ({ ...f, file })); // ✅ keep the File object
      setPreview(URL.createObjectURL(file)); // ✅ create preview
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "isActive") {
      setForm((f) => ({ ...f, isActive: value === "true" }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      // ✅ build multipart/form-data
      const formData = new FormData();
      if (form.file) formData.append("image", form.file);
      formData.append("name", form.name);
      formData.append("pricePerKm", form.pricePerKm);
      formData.append("description", form.description);
      formData.append("isActive", form.isActive);

      await dispatch(createVehicleType(formData)).unwrap();

      // reset form
      setForm({
        file: null,
        name: "",
        pricePerKm: "",
        description: "",
        isActive: true,
      });
      setPreview("");
    } catch (err) {
      console.error("Create vehicle type failed:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">All Vehicles</h1>

          {/* Add Vehicle Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            encType="multipart/form-data" // ✅ important
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded px-3 py-2"
            />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-28 h-20 object-contain rounded mb-2"
              />
            )}

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Car Name"
              className="border rounded px-3 py-2"
              required
            />
            <input
              name="pricePerKm"
              value={form.pricePerKm}
              onChange={handleChange}
              type="number"
              placeholder="Price per km"
              className="border rounded px-3 py-2"
              required
            />
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              type="text"
              placeholder="Description"
              className="border rounded px-3 py-2 md:col-span-2 lg:col-span-3"
            />
            <select
              name="isActive"
              value={form.isActive ? "true" : "false"}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              <option value="true">Active</option>
              <option value="false">Out of Service</option>
            </select>

            <button
              type="submit"
              disabled={busy}
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {busy ? "Adding..." : "Add Vehicle"}
            </button>
          </form>

          {/* Status/Error */}
          {status === "loading" && <p>Loading vehicles...</p>}
          {status === "failed" && <p className="text-red-500">{String(error)}</p>}

          {/* Vehicle table */}
          <VehicleTable vehicles={vehicles} />
        </div>
      </div>
    </div>
  );
};

export default AllVehicles;
