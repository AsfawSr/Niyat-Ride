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
  // Backend fields: passengerName, driverName, requestedAt, completedAt, cancelledAt, finalCost, estimatedCost
  // Old dummy fields: passenger, driver, date, fare, pickup, dropoff
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

  // Nice friendly date field (keeps old UI keys)
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

  // preserve old 'fare' presentation (string with $) so older components don't break
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
    // raw DTO for advanced use
    _raw: dto,
    // canonical fields used by backend-aware components
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
    // legacy-friendly fields (used by many of your existing components)
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
        // parse response for helpful error if possible
        const text = await res.text();
        throw new Error(
          `Fetch failed: ${res.status} ${res.statusText} - ${text.slice(
            0,
            200
          )}`
        );
      }

      const payload = await parseJsonOrThrow(res);

      // payload may be paginated object { content: [...], totalElements, ... } or an array
      if (payload && Array.isArray(payload)) {
        return payload.map(normalizeRide);
      }

      if (payload && Array.isArray(payload.content)) {
        // return same shape but with normalized content and pass through pagination meta
        return {
          ...payload,
          content: payload.content.map(normalizeRide),
        };
      }

      // If payload is an object but not array/content, try to find rides field or return normalized single
      if (payload && payload.rides && Array.isArray(payload.rides)) {
        return {
          ...payload,
          rides: payload.rides.map(normalizeRide),
        };
      }

      // unexpected shape: return normalized single ride (or empty)
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

export const updateRide = createAsyncThunk(
  "rides/updateRide",
  async (ride, thunkAPI) => {
    try {
      const url = `${baseUrl}/api/admin/rides/${ride.id}`;
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(ride),
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

      // some backends return 204 No Content, some return 200 with a body
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
    rides: [], // array of normalized rides OR if fetchRides returns paginated object, may set content below
    loading: false,
    error: null,
    // optional pagination/meta fields:
    totalElements: null,
    page: 0,
    size: 50,
  },
  reducers: {
    // local setter if you need to set state from components (keeps backward compatibility)
    setRides(state, action) {
      state.rides = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRides
      .addCase(fetchRides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRides.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;

        // If paginated object (we returned { content: [...], totalElements, ... })
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
          // fallback: if payload is single normalized ride or unknown shape
          state.rides = Array.isArray(payload)
            ? payload
            : [payload].filter(Boolean);
        }
      })
      .addCase(fetchRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // fetchRideById - upsert single
      .addCase(fetchRideById.fulfilled, (state, action) => {
        const ride = action.payload;
        const idx = state.rides.findIndex((r) => r.id === ride.id);
        if (idx !== -1) state.rides[idx] = ride;
        else state.rides.unshift(ride);
      })
      .addCase(fetchRideById.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // updateRide
      .addCase(updateRide.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.rides.findIndex((r) => r.id === updated.id);
        if (idx !== -1) state.rides[idx] = updated;
        else state.rides.unshift(updated);
      })
      .addCase(updateRide.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // deleteRide
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
