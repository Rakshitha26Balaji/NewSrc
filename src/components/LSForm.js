import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Button,
  Grid,
  InputAdornment,
  Card,
  Container,
} from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import {
  SearchRounded,
  NorthRounded,
  SouthRounded,
  RestartAltRounded,
  EditRounded,
  DeleteRounded,
  CloseRounded,
  CheckRounded,
} from "@mui/icons-material";

import { useForm, Controller } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";

const LostForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const tenderTypes = ["single tender", "EOI", "RFI", "RFP", "BQ"];
  const documentTypeOptions = ["PDF", "Docx"];

  const API = "/getLostForms";

  let user = JSON.parse(localStorage.getItem("user"));
  console.log(" user object ", user);

  // ------------------- NETWORKING -------------------
  useEffect(() => {
    axios
      .get(`/config.json`)
      .then(function (response) {
        const nodeServer =
          response.data.project[0].ServerIP[0].NodeServerIP + API;
        console.log("LostForm API: ", nodeServer);
        SetServerIp(nodeServer);

        axios
          .get(nodeServer)
          .then((res) => {
            console.log("GOT DATA FROM LOST FORM", res);
            setOrderData(res.data);
          })
          .catch((error) => console.log(error.message));
      })
      .catch(function (error) {
        console.log("config.json LostForm error", error);
        SetServerIp("172.195.120.135");
      })
      .finally(function () {
        // always executed
      });
  }, []);

  // ------------------- FORM CONFIG -------------------
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tenderName: "",
      tenderReferenceNo: "",
      customerName: "",
      customerAddress: "",
      tenderType: "",
      documentType: "",
      valueInCrWithoutGST: "",
      valueInCrWithGST: "",
      reasonForLossing: "",
      yearWeLost: "",
      partners: "",
      competitors: "",
      technicalScore: "",
      quotedPrice: "",
    },
  });

  // ------------------- SUBMIT HANDLER -------------------
  const onSubmit = (data) => {
    console.log("Raw Form Data:", data);

    const formattedData = {
      tenderName: data.tenderName,
      tenderReferenceNo: data.tenderReferenceNo,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      tenderType: data.tenderType,
      documentType: data.documentType,
      valueInCrWithoutGST:
        data.valueInCrWithoutGST !== ""
          ? parseFloat(parseFloat(data.valueInCrWithoutGST).toFixed(5))
          : null,
      valueInCrWithGST:
        data.valueInCrWithGST !== ""
          ? parseFloat(parseFloat(data.valueInCrWithGST).toFixed(5))
          : null,
      reasonForLossing: data.reasonForLossing,
      yearWeLost: data.yearWeLost,
      partners: data.partners,
      competitors: data.competitors,
      technicalScore: data.technicalScore || "",
      quotedPrice: data.quotedPrice || "",
      OperatorId: user?.id || "291536",
      OperatorName: user?.username || "Vivek Kumar Singh",
      OperatorRole: user?.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
    };

    console.log(
      "Frontend Form of lost data:",
      JSON.stringify(formattedData, null, 2)
    );

    axios
      .post(ServerIp, formattedData)
      .then((response) => {
        console.log("Server Response:", response.data);
        setOrderData(response.data);
        setSubmittedData(formattedData);
        setSubmitSuccess(true);
      })
      .catch((error) => console.log(error.message));
  };

  // ------------------- RESET -------------------
  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  // ------------------- SNACKBAR CLOSE -------------------
  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  // ------------------- DOWNLOAD JSON -------------------
  const handleDownloadJSON = () => {
    if (submittedData) {
      const dataStr = JSON.stringify(submittedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lost-form-${submittedData.serialNumber || "entry"}-${
        Date.now()
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // ------------------- RENDER -------------------
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 5,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3eeff 0%, #f8fbff 100%)",
        borderRadius: 4,
      }}
    >
      {/* ------------------------ TABS ------------------------ */}
      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        centered
        sx={{
          mb: 4,
          "& .MuiTab-root": {
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            px: 4,
          },
          "& .Mui-selected": {
            color: "#0d47a1 !important",
          },
          "& .MuiTabs-indicator": {
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #0d47a1, #42a5f5, #1e88e5)",
          },
        }}
      >
        <Tab label="Create Data" />
        <Tab label="View Data" />
      </Tabs>

      {/* ------------------------ CREATE FORM ------------------------ */}
      {value === 0 && (
        <Paper
          elevation={10}
          sx={{
            p: { xs: 2, md: 5 },
            borderRadius: 5,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(14px)",
            transition: "0.3s",
            boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
            "&:hover": { transform: "scale(1.01)" },
          }}
        >
          {/* Title */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                background:
                  "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Lost Form
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ opacity: 0.7, mt: 1, fontWeight: 500 }}
            >
              Capture key details for tenders that were lost, for future
              analysis and learning.
            </Typography>
          </Box>

          {/* ------------------- FORM START ------------------- */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ---------------- SECTION: BASIC INFO ---------------- */}
            <Card
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.8)",
                backdropFilter: "blur(10px)",
                transition: "0.3s",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
              >
                📋 Basic Tender Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* tenderName */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="tenderName"
                    control={control}
                    rules={{ required: "Tender Name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tender Name"
                        fullWidth
                        required
                        error={!!errors.tenderName}
                        helperText={errors.tenderName?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            "&:hover": { boxShadow: "0 0 10px #bbdefb" },
                            "&.Mui-focused": {
                              boxShadow: "0 0 15px #90caf9",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* tenderReferenceNo */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="tenderReferenceNo"
                    control={control}
                    rules={{ required: "Tender Reference No is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tender Reference No"
                        fullWidth
                        required
                        error={!!errors.tenderReferenceNo}
                        helperText={errors.tenderReferenceNo?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            "&:hover": { boxShadow: "0 0 10px #bbdefb" },
                            "&.Mui-focused": {
                              boxShadow: "0 0 15px #90caf9",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* customerName */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="customerName"
                    control={control}
                    rules={{ required: "Customer Name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Customer Name"
                        fullWidth
                        required
                        error={!!errors.customerName}
                        helperText={errors.customerName?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            "&:hover": { boxShadow: "0 0 10px #bbdefb" },
                            "&.Mui-focused": {
                              boxShadow: "0 0 15px #90caf9",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* customerAddress */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="customerAddress"
                    control={control}
                    rules={{ required: "Customer Address is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Customer Address"
                        fullWidth
                        required
                        error={!!errors.customerAddress}
                        helperText={errors.customerAddress?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            "&:hover": { boxShadow: "0 0 10px #bbdefb" },
                            "&.Mui-focused": {
                              boxShadow: "0 0 15px #90caf9",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* tenderType */}
                <Grid item xs={12} sm={3}>
                  <Controller
                    name="tenderType"
                    control={control}
                    rules={{ required: "Tender Type is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Tender Type"
                        fullWidth
                        required
                        error={!!errors.tenderType}
                        helperText={errors.tenderType?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            minWidth: 200,
                          },
                        }}
                      >
                        {tenderTypes.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* documentType */}
                <Grid item xs={12} sm={3}>
                  <Controller
                    name="documentType"
                    control={control}
                    rules={{ required: "Document Type is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Document Type"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.documentType}
                        helperText={errors.documentType?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            minWidth: 200,
                          },
                        }}
                      >
                        {documentTypeOptions.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* ---------------- SECTION: FINANCIAL ---------------- */}
            <Card
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.8)",
                backdropFilter: "blur(10px)",
                transition: "0.3s",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
              >
                💰 Financial Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* valueInCrWithoutGST */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="valueInCrWithoutGST"
                    control={control}
                    rules={{
                      required: "Value without GST is required",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]+)?$/,
                        message: "Please enter a valid number",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Value in CR without GST"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.valueInCrWithoutGST}
                        helperText={errors.valueInCrWithoutGST?.message}
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1 }}>₹</Typography>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* valueInCrWithGST */}
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="valueInCrWithGST"
                    control={control}
                    rules={{
                      required: "Value with GST is required",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]+)?$/,
                        message: "Please enter a valid number",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Value in CR with GST"
                        type="number"
                        fullWidth
                        required
                        error={!!errors.valueInCrWithGST}
                        helperText={errors.valueInCrWithGST?.message}
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1 }}>₹</Typography>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* ---------------- SECTION: LOSS & COMPETITORS ---------------- */}
            <Card
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.8)",
                backdropFilter: "blur(10px)",
                transition: "0.3s",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
              >
                📝 Loss Details & Competitors
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* reasonForLossing */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="reasonForLossing"
                    control={control}
                    rules={{ required: "Reason for Lossing is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Reason for Losing"
                        fullWidth
                        required
                        error={!!errors.reasonForLossing}
                        helperText={errors.reasonForLossing?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* yearWeLost */}
                <Grid item xs={12} sm={3}>
                  <Controller
                    name="yearWeLost"
                    control={control}
                    rules={{ required: "Year we Lost is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Year we Lost"
                        fullWidth
                        required
                        error={!!errors.yearWeLost}
                        helperText={errors.yearWeLost?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* partners */}
                <Grid item xs={12} sm={3}>
                  <Controller
                    name="partners"
                    control={control}
                    rules={{ required: "Partners is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Partners"
                        fullWidth
                        required
                        error={!!errors.partners}
                        helperText={errors.partners?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* competitors */}
                <Grid item xs={12}>
                  <Controller
                    name="competitors"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Competitors (Optional)"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        placeholder="Enter competitor names separated by commas (e.g., Company A, Company B)"
                        helperText="List all competing companies for this tender"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* ---------------- SECTION: SCORES ---------------- */}
            <Card
              sx={{
                mb: 2,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.8)",
                backdropFilter: "blur(10px)",
                transition: "0.3s",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
              >
                📊 Technical & Commercial
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* technicalScore */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="technicalScore"
                    control={control}
                    rules={{ required: "Technical Score is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Technical Score"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.technicalScore}
                        helperText={errors.technicalScore?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* quotedPrice */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="quotedPrice"
                    control={control}
                    rules={{ required: "Quoted Price is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Quoted Price"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.quotedPrice}
                        helperText={errors.quotedPrice?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* ---------------- BUTTONS ---------------- */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mt: 4,
                flexWrap: "wrap",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.6,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  fontWeight: 700,
                  background: "linear-gradient(90deg, #1565c0, #42a5f5)",
                  textTransform: "none",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    background: "linear-gradient(90deg, #0d47a1, #1e88e5)",
                  },
                }}
              >
                🚀 Submit Lost Form
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={handleReset}
                sx={{
                  px: 6,
                  py: 1.6,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  fontWeight: 700,
                  borderWidth: 2,
                  textTransform: "none",
                  "&:hover": {
                    transform: "scale(1.03)",
                    background: "#f4f6fb",
                  },
                }}
              >
                Reset
              </Button>
            </Box>
          </form>

          {/* ---------------- SUCCESS SNACKBAR ---------------- */}
          <Snackbar
            open={submitSuccess}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success" sx={{ fontSize: "1rem" }}>
              🎉 Lost form submitted successfully!
            </Alert>
          </Snackbar>

          {/* ---------------- JSON OUTPUT ---------------- */}
          {submittedData && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                📊 Submitted Data (JSON)
              </Typography>

              <Paper
                sx={{
                  p: 3,
                  background: "#0d1117",
                  color: "#c9d1d9",
                  borderRadius: 4,
                  maxHeight: 500,
                  overflow: "auto",
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <pre>{JSON.stringify(submittedData, null, 2)}</pre>
              </Paper>

              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  background: "#2e7d32",
                  "&:hover": { background: "#1b5e20" },
                }}
                onClick={handleDownloadJSON}
              >
                Download JSON
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {/* ------------------------ VIEW DATA ------------------------ */}
      {value === 1 && orderData && <ViewLostData ViewData={orderData} />}
    </Container>
  );
};

function ViewLostData(props) {
  console.log("props ViewLostData", props.ViewData);

  // ---------------- STATES ----------------
  const [searchTerm, setSearchTerm] = useState("");
  const [tenderTypeFilter, setTenderTypeFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRow, setSelectedRow] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const tenderTypes = ["single tender", "EOI", "RFI", "RFP", "BQ"];

  // ---------------- HANDLERS ----------------
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleTenderTypeFilterChange = (e) =>
    setTenderTypeFilter(e.target.value);
  const handleYearFilterChange = (e) => setYearFilter(e.target.value);
  const handleSortByChange = (e) => setSortBy(e.target.value);
  const toggleSortDirection = () =>
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleResetFilters = () => {
    setSearchTerm("");
    setTenderTypeFilter("all");
    setYearFilter("all");
    setSortBy("dateCreated");
    setSortDirection("desc");
  };

  const handleRowSelect = (row) => setSelectedRow(row);

  const handleEditClick = (row, e) => {
    if (e) e.stopPropagation();
    setEditingRow({ ...row });
    setEditDialogOpen(true);
  };

  const handleEditFieldChange = (field, value) => {
    setEditingRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingRow(null);
  };

  const handleEditSave = () => {
    console.log("Saving updated lost row:", editingRow);
    // TODO: update to backend as needed
    setEditDialogOpen(false);
  };

  const handleDeleteClick = (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    console.log("Deleting lost row with ID:", id);
    // TODO: delete logic here
  };

  const yearsList = ["all", "2021", "2022", "2023", "2024", "2025"];

  return (
    <>
      {/* HEADER + CONTROLS */}
      <Box
        sx={{
          mb: 3,
          px: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 3 },
            boxShadow: 6,
            background:
              "linear-gradient(135deg, #e0f7ff 0%, #c8f0ff 40%, #a6e9ff 100%)",
            color: "#06283D",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                User Profile Created List
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.85, mt: 0.5, maxWidth: 520 }}
              >
                View, search, filter and manage all lost tender entries in a
                single, elegant dashboard.
              </Typography>
            </Box>

            {/* SEARCH BOX */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by tender, customer, reference..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: { xs: "100%", sm: 260, md: 320 },
                backgroundColor: "rgba(240,248,255,0.9)",
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  color: "#0f172a",
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(100,116,139,0.8)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#475569",
                },
              }}
            />
          </Box>

          {/* FILTERS + SORT */}
          <Box
            sx={{
              mt: 2.5,
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            {/* TENDER TYPE FILTER */}
            <TextField
              select
              size="small"
              label="Tender Type"
              value={tenderTypeFilter}
              onChange={handleTenderTypeFilterChange}
              sx={{
                minWidth: 180,
                backgroundColor: "rgba(240,248,255,0.9)",
                borderRadius: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  color: "#0f172a",
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(100,116,139,0.8)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": { color: "#475569" },
              }}
            >
              <MenuItem value="all">All</MenuItem>
              {tenderTypes.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            {/* YEAR FILTER */}
            <TextField
              select
              size="small"
              label="Year We Lost"
              value={yearFilter}
              onChange={handleYearFilterChange}
              sx={{
                minWidth: 170,
                backgroundColor: "rgba(240,248,255,0.9)",
                borderRadius: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  color: "#0f172a",
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(100,116,139,0.8)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": { color: "#475569" },
              }}
            >
              {yearsList.map((y) => (
                <MenuItem key={y} value={y}>
                  {y === "all" ? "All" : y}
                </MenuItem>
              ))}
            </TextField>

            {/* SORT BY FILTER */}
            <TextField
              select
              size="small"
              label="Sort by"
              value={sortBy}
              onChange={handleSortByChange}
              sx={{
                minWidth: 170,
                backgroundColor: "rgba(240,248,255,0.9)",
                borderRadius: 2.5,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  color: "#0f172a",
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(100,116,139,0.8)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#3b82f6",
                  },
                },
                "& .MuiInputLabel-root": { color: "#475569" },
              }}
            >
              <MenuItem value="dateCreated">Created Date</MenuItem>
              <MenuItem value="year">Year Lost</MenuItem>
              <MenuItem value="valueInCrWithoutGST">
                Value (w/o GST, CR)
              </MenuItem>
              <MenuItem value="valueWithGST">Value (with GST, CR)</MenuItem>
            </TextField>

            {/* SORT ICON BUTTON */}
            <Tooltip
              title={`Sort ${
                sortDirection === "asc" ? "Descending" : "Ascending"
              }`}
            >
              <IconButton
                onClick={toggleSortDirection}
                sx={{
                  ml: 0.5,
                  borderRadius: 2.5,
                  border: "1px solid rgba(148,163,184,0.7)",
                  backgroundColor: "rgba(240,248,255,0.9)",
                  color: "#0f172a",
                  "&:hover": {
                    backgroundColor: "rgba(224,242,254,1)",
                  },
                }}
              >
                {sortDirection === "asc" ? <SouthRounded /> : <NorthRounded />}
              </IconButton>
            </Tooltip>

            {/* RESET BUTTON */}
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              startIcon={<RestartAltRounded />}
              sx={{
                ml: { xs: 0, sm: "auto" },
                borderRadius: 999,
                border: "2px solid #0E4C92",
                color: "#0E4C92",
                textTransform: "none",
                px: 3,
                py: 0.8,
                fontWeight: 600,
                backgroundColor: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(6px)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                transition: "0.2s ease",
                "&:hover": {
                  backgroundColor: "#d0eaff",
                  borderColor: "#0A3C7D",
                  color: "#0A3C7D",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Box>

      {/* TABLE */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1800px",
          mx: "auto",
          mt: 2,
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            boxShadow: 8,
            overflowX: "auto",
            overflowY: "auto",
            maxHeight: "75vh",
            minWidth: "100%",
          }}
        >
          <Table stickyHeader aria-label="lost tenders table" size="small">
            <TableHead>
              {[
                "Tender Name",
                "Tender Reference No",
                "Customer Name",
                "Customer Address",
                "Tender Type",
                "Document Type",
                "Value in CR w/o GST",
                "Value in CR with GST",
                "Reason for Losing",
                "Year we Lost",
                "Partners",
                "Competitors",
                "Technical Score",
                "Quoted Price",
                "Created Date",
                "Actions",
              ].map((header, idx) => (
                <TableCell
                  key={header}
                  align={idx === 0 ? "left" : idx === 15 ? "center" : "left"}
                  sx={{
                    fontWeight: 800,
                    fontSize: 13,
                    color: "#f9fafb",
                    background:
                      "linear-gradient(90deg,#0ea5e9 0%,#2563eb 50%,#4f46e5 100%)",
                    borderBottom: "none",
                    whiteSpace: "nowrap",
                    ...(header === "Customer Address"
                      ? { minWidth: 200 }
                      : {}),
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableHead>

            <TableBody>
              {props.ViewData.data &&
                props.ViewData.data.length > 0 &&
                props.ViewData.data
                  .filter((row) => {
                    const q = searchTerm.toLowerCase();
                    const matchesSearch =
                      !q ||
                      row.tenderName?.toLowerCase().includes(q) ||
                      row.customerName?.toLowerCase().includes(q) ||
                      row.tenderReferenceNo?.toLowerCase().includes(q) ||
                      row.customerAddress?.toLowerCase().includes(q);

                    const matchesTenderType =
                      tenderTypeFilter === "all" ||
                      row.tenderType === tenderTypeFilter;

                    const matchesYear =
                      yearFilter === "all" ||
                      String(row.year || row.yearWeLost || "").includes(
                        yearFilter
                      );

                    return matchesSearch && matchesTenderType && matchesYear;
                  })
                  .sort((a, b) => {
                    let aVal;
                    let bVal;

                    switch (sortBy) {
                      case "year":
                        aVal = a.year || a.yearWeLost || "";
                        bVal = b.year || b.yearWeLost || "";
                        break;
                      case "valueInCrWithoutGST":
                        aVal = parseFloat(a.valueInCrWithoutGST) || 0;
                        bVal = parseFloat(b.valueInCrWithoutGST) || 0;
                        break;
                      case "valueWithGST":
                        aVal = parseFloat(a.valueWithGST) || 0;
                        bVal = parseFloat(b.valueWithGST) || 0;
                        break;
                      case "dateCreated":
                      default:
                        aVal = a.dateCreated || "";
                        bVal = b.dateCreated || "";
                        break;
                    }

                    if (typeof aVal === "string") aVal = aVal.toLowerCase();
                    if (typeof bVal === "string") bVal = bVal.toLowerCase();

                    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
                    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
                    return 0;
                  })
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      selected={selectedRow?.id === row.id}
                      onClick={() => handleRowSelect(row)}
                      sx={{
                        cursor: "pointer",
                        transition: "all 0.18s ease-out",
                        "&:hover": {
                          backgroundColor: "rgba(59,130,246,0.06)",
                          boxShadow: 1,
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.tenderName}
                      </TableCell>

                      <TableCell
                        sx={{
                          fontSize: 14,
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.tenderReferenceNo}
                      </TableCell>

                      <TableCell
                        sx={{
                          fontSize: 14,
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.customerName}
                      </TableCell>

                      <TableCell
                        align="left"
                        sx={{
                          fontSize: 13,
                          maxWidth: 260,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.customerAddress}
                      </TableCell>

                      {/* Tender Type with Chip */}
                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        <Chip
                          size="small"
                          label={row.tenderType || "-"}
                          sx={{
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            backgroundColor: "rgba(59,130,246,0.12)",
                            color: "#1d4ed8",
                          }}
                        />
                      </TableCell>

                      {/* Document Type */}
                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        <Chip
                          size="small"
                          label={row.documentType || "-"}
                          sx={{
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            backgroundColor: "rgba(129,140,248,0.18)",
                            color: "#4338ca",
                          }}
                        />
                      </TableCell>

                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.valueInCrWithoutGST}
                      </TableCell>

                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.valueWithGST}
                      </TableCell>

                      <TableCell
                        align="left"
                        sx={{
                          fontSize: 13,
                          maxWidth: 200,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.reasonLosing}
                      </TableCell>

                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.year}
                      </TableCell>

                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.partner}
                      </TableCell>

                      <TableCell
                        align="left"
                        sx={{
                          fontSize: 13,
                          maxWidth: 200,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.competitors}
                      </TableCell>

                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.technicalScores}
                      </TableCell>

                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.quotedPrices}
                      </TableCell>

                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.dateCreated}
                      </TableCell>

                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={(e) => handleEditClick(row, e)}
                              sx={{
                                borderRadius: 2,
                                backgroundColor: "rgba(59,130,246,0.12)",
                                "&:hover": {
                                  backgroundColor: "rgba(59,130,246,0.25)",
                                },
                              }}
                            >
                              <EditRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              onClick={(e) =>
                                handleDeleteClick(row.id, e)
                              }
                              sx={{
                                borderRadius: 2,
                                backgroundColor: "rgba(239,68,68,0.12)",
                                "&:hover": {
                                  backgroundColor: "rgba(239,68,68,0.25)",
                                },
                              }}
                            >
                              <DeleteRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              {(!props.ViewData.data || props.ViewData.data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={16} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#6b7280" }}>
                      No lost tenders found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* EDIT DIALOG */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background:
              "linear-gradient(135deg,#020617 0%,#0f172a 40%,#1d4ed8 100%)",
            color: "#e5e7eb",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 2,
          }}
        >
          Edit Lost Entry
          <IconButton
            onClick={handleEditCancel}
            sx={{
              color: "#9ca3af",
              "&:hover": { color: "#f9fafb", backgroundColor: "transparent" },
            }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            borderColor: "rgba(148,163,184,0.4)",
            background: "rgba(15,23,42,0.85)",
          }}
        >
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tender Name"
                value={editingRow?.tenderName || ""}
                onChange={(e) =>
                  handleEditFieldChange("tenderName", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tender Reference No"
                value={editingRow?.tenderReferenceNo || ""}
                onChange={(e) =>
                  handleEditFieldChange("tenderReferenceNo", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Customer Name"
                value={editingRow?.customerName || ""}
                onChange={(e) =>
                  handleEditFieldChange("customerName", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Customer Address"
                value={editingRow?.customerAddress || ""}
                onChange={(e) =>
                  handleEditFieldChange("customerAddress", e.target.value)
                }
                fullWidth
                size="small"
                multiline
                minRows={2}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Tender Type"
                value={editingRow?.tenderType || ""}
                onChange={(e) =>
                  handleEditFieldChange("tenderType", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Document Type"
                value={editingRow?.documentType || ""}
                onChange={(e) =>
                  handleEditFieldChange("documentType", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Value in CR (w/o GST)"
                value={editingRow?.valueInCrWithoutGST || ""}
                onChange={(e) =>
                  handleEditFieldChange(
                    "valueInCrWithoutGST",
                    e.target.value
                  )
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Value in CR (with GST)"
                value={editingRow?.valueWithGST || ""}
                onChange={(e) =>
                  handleEditFieldChange("valueWithGST", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Reason for Losing"
                value={editingRow?.reasonLosing || ""}
                onChange={(e) =>
                  handleEditFieldChange("reasonLosing", e.target.value)
                }
                fullWidth
                size="small"
                multiline
                minRows={2}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Year we Lost"
                value={editingRow?.year || ""}
                onChange={(e) => handleEditFieldChange("year", e.target.value)}
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Partners"
                value={editingRow?.partner || ""}
                onChange={(e) =>
                  handleEditFieldChange("partner", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Competitors"
                value={editingRow?.competitors || ""}
                onChange={(e) =>
                  handleEditFieldChange("competitors", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Technical Score"
                value={editingRow?.technicalScores || ""}
                onChange={(e) =>
                  handleEditFieldChange("technicalScores", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Quoted Price"
                value={editingRow?.quotedPrices || ""}
                onChange={(e) =>
                  handleEditFieldChange("quotedPrices", e.target.value)
                }
                fullWidth
                size="small"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    color: "#e5e7eb",
                    backgroundColor: "rgba(15,23,42,0.85)",
                  },
                  "& .MuiInputLabel-root": { color: "#9ca3af" },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: "1px solid rgba(148,163,184,0.4)",
            background: "rgba(15,23,42,0.95)",
          }}
        >
          <Button
            onClick={handleEditCancel}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 2.5,
              color: "#e5e7eb",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleEditSave}
            startIcon={<CheckRounded />}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 3,
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#22c55e 0%,#16a34a 40%,#22c55e 100%)",
              boxShadow:
                "0 10px 25px rgba(22,163,74,0.45), 0 0 0 1px rgba(21,128,61,0.4)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#16a34a 0%,#15803d 40%,#16a34a 100%)",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LostForm;
