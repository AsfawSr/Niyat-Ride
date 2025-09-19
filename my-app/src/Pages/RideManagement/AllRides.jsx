// src/Pages/RideManagement/AllRides.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Tooltip,
  TableContainer,
  Paper,
} from "@mui/material";
import { FaEye, FaEdit } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import { fetchRides, updateRide } from "../../store/ridesSlice";

export default function AllRides() {
  const dispatch = useDispatch();
  const { rides, loading, error } = useSelector((state) => state.rides);

  // UI state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // modals
  const [viewRide, setViewRide] = useState(null);
  const [editRide, setEditRide] = useState(null);

  // fetch rides on mount
  useEffect(() => {
    dispatch(fetchRides({ page: 0, size: 100 }));
  }, [dispatch]);

  // derived data: filter + paginate
  const filteredRides = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rides.filter((r) => {
      const matchesStatus = filterStatus ? r.status === filterStatus : true;
      const matchesSearch =
        !s ||
        String(r.id).toLowerCase().includes(s) ||
        r.passengerName?.toLowerCase().includes(s) ||
        r.driverName?.toLowerCase().includes(s);
      return matchesStatus && matchesSearch;
    });
  }, [rides, search, filterStatus]);

  const pageStart = page * rowsPerPage;
  const pageRows = filteredRides.slice(pageStart, pageStart + rowsPerPage);

  // pagination handlers
  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // edit handlers
  const handleEditOpen = (ride) =>
    setEditRide({ id: ride.id, status: ride.status });

  const handleEditSave = async () => {
    if (editRide) {
      await dispatch(updateRide({ id: editRide.id, status: editRide.status }));
      // immediately refresh the rides list so UI is up to date
      dispatch(fetchRides({ page: 0, size: 100 }));
    }
    setEditRide(null);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f6f7fb", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box component="main" sx={{ p: 3, flex: 1 }}>
          {/* Filters */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
            <TextField
              label="Search by Ride / Passenger / Driver"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              sx={{ flex: 1, minWidth: 240, bgcolor: "#fff" }}
            />
            <FormControl size="small" sx={{ minWidth: 180, bgcolor: "#fff" }}>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(0);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="REQUESTED">Requested</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Table */}
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                All Rides
              </Typography>
              {loading && <Typography>Loading rides...</Typography>}
              {error && <Typography color="error">{error}</Typography>}
              <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ride ID</TableCell>
                      <TableCell>Passenger</TableCell>
                      <TableCell>Driver</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Fare</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageRows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No rides available.
                        </TableCell>
                      </TableRow>
                    ) : (
                      pageRows.map((ride) => (
                        <TableRow key={ride.id} hover>
                          <TableCell>{ride.id}</TableCell>
                          <TableCell>{ride.passengerName}</TableCell>
                          <TableCell>{ride.driverName}</TableCell>
                          <TableCell>{ride.statusLabel}</TableCell>
                          <TableCell>
                            {ride.requestedAt?.split("T")[0] ||
                              ride.completedAt?.split("T")[0]}
                          </TableCell>
                          <TableCell>
                            {ride.finalCost
                              ? `$${ride.finalCost}`
                              : ride.estimatedCost
                              ? `$${ride.estimatedCost}`
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Tooltip title="View">
                              <IconButton
                                color="primary"
                                onClick={() => setViewRide(ride)}
                              >
                                <FaEye />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit Status">
                              <IconButton
                                color="success"
                                onClick={() => handleEditOpen(ride)}
                              >
                                <FaEdit />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <TablePagination
              component="div"
              count={filteredRides.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        </Box>
      </Box>

      {/* ----- View Modal ----- */}
      <Dialog
        open={!!viewRide}
        onClose={() => setViewRide(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Ride Details</DialogTitle>
        <DialogContent dividers>
          {viewRide && (
            <>
              <Typography>
                <b>Ride ID:</b> {viewRide.id}
              </Typography>
              <Typography>
                <b>Passenger:</b> {viewRide.passengerName}
              </Typography>
              <Typography>
                <b>Driver:</b> {viewRide.driverName}
              </Typography>
              <Typography>
                <b>Status:</b> {viewRide.statusLabel}
              </Typography>
              <Typography>
                <b>Fare:</b>{" "}
                {viewRide.finalCost
                  ? `$${viewRide.finalCost}`
                  : `$${viewRide.estimatedCost || 0}`}
              </Typography>
              <Typography>
                <b>Pickup:</b> {viewRide.pickup}
              </Typography>
              <Typography>
                <b>Drop-off:</b> {viewRide.dropoff}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRide(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ----- Edit Modal (Status only) ----- */}
      <Dialog
        open={!!editRide}
        onClose={() => setEditRide(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Ride Status</DialogTitle>
        <DialogContent dividers>
          {editRide && (
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editRide.status || ""}
                onChange={(e) =>
                  setEditRide((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="REQUESTED">Requested</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRide(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
