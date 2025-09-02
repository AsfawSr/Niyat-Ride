import React, { useMemo, useState } from "react";
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
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar";
import Topbar from "../../Components/Topbar";
import { updateRide, deleteRide } from "../../store/ridesSlice"; // ✅ NEW: Redux actions

export default function AllRides() {
  const dispatch = useDispatch();
  // ✅ NEW: use useSelector to get the rides from the Redux store state.
  const rides = useSelector((state) => state.rides.rides);

  // UI state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // modals
  const [viewRide, setViewRide] = useState(null);
  const [editRide, setEditRide] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ----- derived data: filter + paginate -----
  const filteredRides = useMemo(() => {
    const s = search.trim().toLowerCase();
    return rides.filter((r) => {
      const matchesStatus = filterStatus ? r.status === filterStatus : true;
      const matchesSearch =
        !s ||
        r.id.toLowerCase().includes(s) ||
        r.passenger.toLowerCase().includes(s) ||
        r.driver.toLowerCase().includes(s);
      return matchesStatus && matchesSearch;
    });
  }, [rides, search, filterStatus]);

  const pageStart = page * rowsPerPage;
  const pageEnd = pageStart + rowsPerPage;
  const pageRows = filteredRides.slice(pageStart, pageEnd);

  // ----- pagination handlers -----
  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // ----- edit handlers -----
  const handleEditOpen = (ride) => setEditRide({ ...ride });
  const handleEditChange = (field, value) =>
    setEditRide((prev) => ({ ...prev, [field]: value }));
  const handleEditSave = () => {
    // ✅ NEW: Dispatch the updateRide action with the updated ride object.
    dispatch(updateRide(editRide));
    setEditRide(null);
  };

  // ----- delete handlers -----
  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    // ✅ NEW: Dispatch the deleteRide action with the ride's ID.
    dispatch(deleteRide(deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f6f7fb", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />

        <Box component="main" sx={{ p: 3, flex: 1 }}>
          {/* Filters */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mb: 2,
              position: "sticky",
              top: 64, // height of your Topbar
              zIndex: 10,
              bgcolor: "#f6f7fb",
              py: 1,
            }}
          >
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
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Table */}
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                All Rides
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Ride ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Passenger</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Driver</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Fare</TableCell>
                      <TableCell sx={{ fontWeight: "bold", bgcolor: "#f9fafb" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pageRows.map((ride) => (
                      <TableRow key={ride.id} hover>
                        <TableCell>{ride.id}</TableCell>
                        <TableCell>{ride.passenger}</TableCell>
                        <TableCell>{ride.driver}</TableCell>
                        <TableCell>{ride.status}</TableCell>
                        <TableCell>{ride.date}</TableCell>
                        <TableCell>{ride.fare}</TableCell>
                        <TableCell>
                          <Tooltip title="View">
                            <IconButton color="primary" onClick={() => setViewRide(ride)}>
                              <FaEye />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton color="success" onClick={() => handleEditOpen(ride)}>
                              <FaEdit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton color="error" onClick={() => setDeleteTarget(ride)}>
                              <FaTrash />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              pt: 1,
              mt: 3,
              bgcolor: "transparent",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
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
      <Dialog open={!!viewRide} onClose={() => setViewRide(null)} fullWidth maxWidth="sm">
        <DialogTitle>Ride Details</DialogTitle>
        <DialogContent dividers>
          {viewRide && (
            <>
              <Typography><b>Ride ID:</b> {viewRide.id}</Typography>
              <Typography><b>Passenger:</b> {viewRide.passenger}</Typography>
              <Typography><b>Driver:</b> {viewRide.driver}</Typography>
              <Typography><b>Status:</b> {viewRide.status}</Typography>
              <Typography><b>Date:</b> {viewRide.date}</Typography>
              <Typography><b>Fare:</b> {viewRide.fare}</Typography>
              <Typography sx={{ mt: 1 }}><b>Pickup:</b> {viewRide.pickup}</Typography>
              <Typography><b>Drop-off:</b> {viewRide.dropoff}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRide(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ----- Edit Modal ----- */}
      <Dialog open={!!editRide} onClose={() => setEditRide(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Ride</DialogTitle>
        <DialogContent dividers>
          {editRide && (
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
              <TextField
                label="Passenger"
                value={editRide.passenger}
                onChange={(e) => handleEditChange("passenger", e.target.value)}
              />
              <TextField
                label="Driver"
                value={editRide.driver}
                onChange={(e) => handleEditChange("driver", e.target.value)}
              />
              <FormControl>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={editRide.status}
                  onChange={(e) => handleEditChange("status", e.target.value)}
                >
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Date (YYYY-MM-DD)"
                value={editRide.date}
                onChange={(e) => handleEditChange("date", e.target.value)}
              />
              <TextField
                label="Fare"
                value={editRide.fare}
                onChange={(e) => handleEditChange("fare", e.target.value)}
              />
              <TextField
                label="Pickup"
                value={editRide.pickup}
                onChange={(e) => handleEditChange("pickup", e.target.value)}
              />
              <TextField
                label="Drop-off"
                value={editRide.dropoff}
                onChange={(e) => handleEditChange("dropoff", e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRide(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* ----- Delete Confirm ----- */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Ride</DialogTitle>
        <DialogContent dividers>
          {deleteTarget && (
            <Typography>
              Are you sure you want to delete <b>{deleteTarget.id}</b> ({deleteTarget.passenger} → {deleteTarget.driver})?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
