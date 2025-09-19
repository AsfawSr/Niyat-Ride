import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Base URL - read from Vite env variable VITE_BASE_URL
 * Make sure your .env contains:
 *   VITE_BASE_URL=https://niyat-ride-1-q0om.onrender.com
 *
 * NOTE: after changing .env you MUST restart the dev server.
 */
const baseUrl =
  import.meta.env.VITE_BASE_URL || "https://niyat-ride-1-q0om.onrender.com";

/** Helper: robustly parse response - returns JSON or throws with helpful text */
async function parseJsonOrThrow(res) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  // If server returned HTML (index.html), contentType likely text/html
  if (!contentType.includes("application/json")) {
    // provide first 300 chars so dev can inspect quickly
    const preview = text
      ? text.slice(0, 300).replace(/\s+/g, " ")
      : "empty body";
    throw new Error(
      `Expected JSON but got '${contentType}'. Response preview: ${preview}`
    );
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error("Failed to parse JSON response: " + err.message);
  }
}

/** Helper: map backend ride DTO -> normalized ride used by UI */
function normalizeRide(dto = {}) {
  const id = dto.id || dto.rideId || dto._id || dto.uuid;

  const rawStatus = (
    dto.status ||
    dto.state ||
    dto.rideStatus ||
    ""
  ).toString();
  const statusLabelMap = {
    IN_PROGRESS: "Ongoing",
    ACCEPTED: "Accepted",
    REQUESTED: "Requested",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    CANCELED: "Cancelled", // possible variant
  };
  const statusLabel =
    statusLabelMap[rawStatus.toUpperCase()] ||
    rawStatus ||
    dto.statusLabel ||
    "";

  const requestedAt =
    dto.requestedAt || dto.requested_at || dto.date || dto.requestedAt;
  const completedAt = dto.completedAt || dto.completed_at;
  const cancelledAt = dto.cancelledAt || dto.cancelled_at;

  const date =
    (requestedAt && requestedAt.split
      ? requestedAt.split("T")[0]
      : requestedAt) ||
    (completedAt && completedAt.split
      ? completedAt.split("T")[0]
      : completedAt) ||
    (dto.date && dto.date.split ? dto.date.split("T")[0] : dto.date) ||
    "";

  const finalCost = dto.finalCost ?? dto.final_cost ?? dto.total ?? null;
  const estimatedCost = dto.estimatedCost ?? dto.estimated_cost ?? null;

  const fare =
    typeof dto.fare === "string"
      ? dto.fare
      : finalCost != null
      ? `$${Number(finalCost).toFixed(2)}`
      : estimatedCost != null
      ? `$${Number(estimatedCost).toFixed(2)}`
      : dto.fare || "$0.00";

  const passengerName =
    dto.passengerName ||
    dto.passenger ||
    dto.customerName ||
    dto.customer ||
    "";
  const driverName = dto.driverName || dto.driver || dto.driver_fullname || "";

  return {
    _raw: dto,
    id,
    passengerName,
    driverName,
    status: rawStatus,
    statusLabel,
    requestedAt,
    completedAt,
    cancelledAt,
    finalCost,
    estimatedCost,
    passenger: passengerName,
    driver: driverName,
    date,
    fare,
    pickup:
      dto.pickupAddress || dto.pickup || dto.origin || dto.fromAddress || "",
    dropoff:
      dto.dropoffAddress ||
      dto.dropoff ||
      dto.destination ||
      dto.toAddress ||
      "",
  };
}

/**
 * Async thunks
 */
export const fetchRides = createAsyncThunk(
  "rides/fetchRides",
  async ({ page = 0, size = 50, status, searchParams = {} } = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams({ page, size, ...searchParams });
      if (status) params.set("status", status);

      const url = `${baseUrl}/api/admin/rides?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Fetch failed: ${res.status} ${res.statusText} - ${text.slice(
            0,
            200
          )}`
        );
      }

      const payload = await parseJsonOrThrow(res);

      if (payload && Array.isArray(payload)) {
        return payload.map(normalizeRide);
      }

      if (payload && Array.isArray(payload.content)) {
        return {
          ...payload,
          content: payload.content.map(normalizeRide),
        };
      }

      if (payload && payload.rides && Array.isArray(payload.rides)) {
        return {
          ...payload,
          rides: payload.rides.map(normalizeRide),
        };
      }

      if (payload) return [normalizeRide(payload)];

      return [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchRideById = createAsyncThunk(
  "rides/fetchRideById",
  async (id, thunkAPI) => {
    try {
      const url = `${baseUrl}/api/admin/rides/${id}`;
      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Fetch failed: ${res.status} ${res.statusText} - ${text.slice(
            0,
            200
          )}`
        );
      }

      const payload = await parseJsonOrThrow(res);
      return normalizeRide(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ updated to use /status endpoint and only send {status}
export const updateRide = createAsyncThunk(
  "rides/updateRide",
  async ({ id, status }, thunkAPI) => {
    try {
      const url = `${baseUrl}/api/admin/rides/${id}/status`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Update failed: ${res.status} ${res.statusText} - ${text.slice(
            0,
            200
          )}`
        );
      }

      const payload = await parseJsonOrThrow(res);
      return normalizeRide(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteRide = createAsyncThunk(
  "rides/deleteRide",
  async (id, thunkAPI) => {
    try {
      const url = `${baseUrl}/api/admin/rides/${id}`;
      const res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.status === 204 || res.ok) {
        return id;
      }

      const text = await res.text();
      throw new Error(
        `Delete failed: ${res.status} ${res.statusText} - ${text.slice(0, 200)}`
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/**
 * Slice & reducers
 */
const ridesSlice = createSlice({
  name: "rides",
  initialState: {
    rides: [],
    loading: false,
    error: null,
    totalElements: null,
    page: 0,
    size: 50,
  },
  reducers: {
    setRides(state, action) {
      state.rides = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRides.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        if (payload && payload.content && Array.isArray(payload.content)) {
          state.rides = payload.content;
          state.totalElements = payload.totalElements ?? state.totalElements;
          state.page = payload.page ?? state.page;
          state.size = payload.size ?? state.size;
        } else if (Array.isArray(payload)) {
          state.rides = payload;
        } else if (payload && payload.rides && Array.isArray(payload.rides)) {
          state.rides = payload.rides;
        } else {
          state.rides = Array.isArray(payload)
            ? payload
            : [payload].filter(Boolean);
        }
      })
      .addCase(fetchRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchRideById.fulfilled, (state, action) => {
        const ride = action.payload;
        const idx = state.rides.findIndex((r) => r.id === ride.id);
        if (idx !== -1) state.rides[idx] = ride;
        else state.rides.unshift(ride);
      })
      .addCase(fetchRideById.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(updateRide.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.rides.findIndex((r) => r.id === updated.id);
        if (idx !== -1) state.rides[idx] = updated;
        else state.rides.unshift(updated);
      })
      .addCase(updateRide.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(deleteRide.fulfilled, (state, action) => {
        state.rides = state.rides.filter((r) => r.id !== action.payload);
      })
      .addCase(deleteRide.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setRides } = ridesSlice.actions;
export default ridesSlice.reducer;
