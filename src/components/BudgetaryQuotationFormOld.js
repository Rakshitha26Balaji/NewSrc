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
  CircularProgress,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import * as XLSX from "xlsx";

import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";

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

// import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";




const BudgetaryQuotationForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const today = new Date().toISOString().split("T")[0];
const now = new Date().toISOString().slice(0, 16);


  const API = "/getBudgetaryQuoatation";
  let user = JSON.parse(localStorage.getItem("user"));
  console.log(" user object ", user);

  // here, we apply the logic networking
  useEffect(() => {
    axios
      .get(`/config.json`)
      .then(function (response) {
        // WE SETTING THE API
        console.log(
          "we are looking for server IP : ",
          response.data.project[0].ServerIP[0].NodeServerIP
        );
        SetServerIp(response.data.project[0].ServerIP[0].NodeServerIP);
        axios
          .get(response.data.project[0].ServerIP[0].NodeServerIP + API)
          .then((response) => {
            setOrderData(response.data);
          })
          .catch((error) => console.log(error.message));
      })
      .catch(function (error) {
        // console.log("config.json BudgetaryQuotationFormerror", error);
        SetServerIp("172.195.120.135");

        // console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }, []);

  // by default values of the form's field
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bqTitle: "",
      customerName: "",
      customerAddress: "",
      leadOwner: "",
      defenceAndNonDefence: "",
      estimateValueInCrWithoutGST: "",
      submittedValueInCrWithoutGST: "",
      dateOfLetterSubmission: "",
      referenceNo: "",
      JSON_competitors: "",
      presentStatus: "",
    },
  });

  const defenceAndNonDefenceOptions = ["Defence", "Non-Defence", "Civil"];
  const statusOptions = [
    "Budgetary Quotation Submitted",
    "Commercial Bid Submitted",
    "EoI was Submitted",
    "Not Participated",
    " ",
  ];

  const onSubmit = (data) => {
    // here we are formatting data so that we can send to backend
    console.log(data);
    const formattedData = {
      bqTitle: data.bqTitle,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      leadOwner: data.leadOwner,
      defenceAndNonDefence: data.defenceAndNonDefence,
      estimateValueInCrWithoutGST: parseFloat(
        parseFloat(data.estimateValueInCrWithoutGST).toFixed(2)
      ),
      submittedValueInCrWithoutGST: parseFloat(
        parseFloat(data.submittedValueInCrWithoutGST).toFixed(2)
      ),
      dateOfLetterSubmission: data.dateOfLetterSubmission,
      referenceNo: data.referenceNo,
      JSON_competitors: data.JSON_competitors,
      presentStatus: data.presentStatus,
      submittedAt: new Date().toISOString(),
      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
    };

    console.log("Frontend Form Data:", JSON.stringify(formattedData, null, 2));

    // HERE WE ARE CALLING THE API
    axios
      .post(ServerIp + API, formattedData)
      .then((response) => {
        console.log(response.data);
        setSubmittedData(formattedData);
        // TO SHOW THE USER
        setSubmitSuccess(true);
      })
      .catch((error) => console.log(error.message));
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  const handleDownloadJSON = () => {
    if (submittedData) {
      const dataStr = JSON.stringify(submittedData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `budgetary-quotation-${
        submittedData.serialNumber
      }-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: -8,
        pb: 2,
        pt: 1, // ⬅️ ADD THIS
        minHeight: "auto", // ⬅️ REMOVE EXTRA PUSH
        background: "linear-gradient(135deg, #e3eeff 0%, #f8fbff 100%)",
        borderRadius: 1,
      }}
    >
      {/* ------------------------ TABS ------------------------ */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Tabs
          value={value}
          onChange={(e, v) => setValue(v)}
          sx={{
            mb: 5,
            gap: 2,

            "& .MuiTabs-indicator": {
              display: "none",
            },

            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              minHeight: 64,
              minWidth: 180,
              borderRadius: 5,
              border: "1px solid #e2e8f0",
              background: "#ffffff",
              color: "#334155",
              display: "flex",
              flexDirection: "row",
              gap: 1.2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "all 0.25s ease",

              "&:hover": {
                borderColor: "#3b82f6",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 28px rgba(59,130,246,0.25)",
              },
            },

            "& .Mui-selected": {
              background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
              color: "#fff !important",
              boxShadow: "0 14px 32px rgba(30,58,138,0.4)",
            },
          }}
        >
          <Tab
            icon={<AddCircleOutlineRoundedIcon />}
            iconPosition="start"
            label="Create Data"
          />
          <Tab
            icon={<VisibilityOutlinedIcon />}
            iconPosition="start"
            label="View Data"
          />
          <Tab
            icon={<CloudUploadOutlinedIcon />}
            iconPosition="start"
            label="Bulk Upload"
          />
        </Tabs>
      </Box>

      {/* ------------------------ CREATE FORM ------------------------ */}
      {value === 0 && (
        <Container maxWidth="lg">
          <Paper
            elevation={10}
            sx={{
              mt: -4,
              p: { xs: 2, md: 5 },
              borderRadius: 5,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(14px)",
              // transition: "0.3s",
              boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
              // "&:hover": { transform: "scale(1.01)" },
            }}
          >
            {/* Title */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Budgetary Quotation Form
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ opacity: 0.7, mt: 1, fontWeight: 500 }}
              >
                Provide details below to create a new BQ entry
              </Typography>
            </Box>

            {/* ------------------- FORM START ------------------- */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ---------------- SECTION: BQ DETAILS ---------------- */}
              <Card
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📋 BQ Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* bqTitle */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="bqTitle"
                      control={control}
                      rules={{ required: "BQ Title is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="BQ Title"
                          fullWidth
                          required
                          error={!!errors.bqTitle}
                          helperText={errors.bqTitle?.message}
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
                  <Grid item xs={12} sm={6}>
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

                  {/* leadOwner */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="leadOwner"
                      control={control}
                      rules={{ required: "Lead Owner is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Lead Owner"
                          fullWidth
                          required
                          error={!!errors.leadOwner}
                          helperText={errors.leadOwner?.message}
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
                  // transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  💰 Classification & Financial Info
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* defenceAndNonDefence */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="defenceAndNonDefence"
                      control={control}
                      rules={{ required: "Classification required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Defence / Non-Defence"
                          fullWidth
                          required
                          error={!!errors.defenceAndNonDefence}
                          helperText={errors.defenceAndNonDefence?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              minWidth: 220,
                            },
                          }}
                        >
                          {defenceAndNonDefenceOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* estimateValueInCrWithoutGST */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="estimateValueInCrWithoutGST"
                      control={control}
                      rules={{
                        required: "Value required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: "Invalid number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Value Without GST"
                          fullWidth
                          type="number"
                          InputProps={{
                            startAdornment: (
                              <Typography sx={{ mr: 1 }}>₹</Typography>
                            ),
                          }}
                          required
                          error={!!errors.estimateValueInCrWithoutGST}
                          helperText={
                            errors.estimateValueInCrWithoutGST?.message
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* submittedValueInCrWithoutGST */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="submittedValueInCrWithoutGST"
                      control={control}
                      rules={{
                        required: "Value required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]{1,2})?$/,
                          message: "Invalid number",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Value With GST"
                          fullWidth
                          type="number"
                          InputProps={{
                            startAdornment: (
                              <Typography sx={{ mr: 1 }}>₹</Typography>
                            ),
                          }}
                          required
                          error={!!errors.submittedValueInCrWithoutGST}
                          helperText={
                            errors.submittedValueInCrWithoutGST?.message
                          }
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

              {/* ---------------- SECTION: ADDITIONAL ---------------- */}
              <Card
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  transition: "0.3s",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                  // "&:hover": {
                  //   transform: "translateY(-4px)",
                  //   boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  // },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📝 Additional Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {/* referenceNo */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="referenceNo"
                      control={control}
                      rules={{ required: "Reference Number required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Reference Number"
                          fullWidth
                          required
                          error={!!errors.referenceNo}
                          helperText={errors.referenceNo?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* dateOfLetterSubmission */}
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="dateOfLetterSubmission"
                      control={control}
                      rules={{ required: "Date required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          label="Letter Submission Date"
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          required
                          inputProps={{
                            max: new Date().toISOString().split("T")[0], // ⬅️ TODAY
                          }}
                          error={!!errors.dateOfLetterSubmission}
                          helperText={errors.dateOfLetterSubmission?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* presentStatus */}
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name="presentStatus"
                      control={control}
                      rules={{ required: "Status required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Present Status"
                          fullWidth
                          required
                          error={!!errors.presentStatus}
                          helperText={errors.presentStatus?.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 3,
                              minWidth: 320,
                            },
                          }}
                        >
                          {statusOptions.map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* competitors */}
                  <Grid item xs={12} sm={8}>
                    <Controller
                      name="JSON_competitors"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Competitors (Optional)"
                          placeholder="Company A, Company B..."
                          fullWidth
                          multiline
                          rows={1}
                          helperText="Separate competitors with commas"
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
                  🚀 Submit BQ
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
                🎉 BQ submitted successfully!
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
        </Container>
      )}

      {/* ------------------------ VIEW DATA ------------------------ */}
      {value === 1 && orderData && (
        <ViewBudgetaryQuotationData ViewData={orderData} />
      )}

      {/* ------------------------ BULK UPLOAD ------------------------ */}
      {value === 2 && (
        <ExcelUploadAndValidate user={user} ServerIp={ServerIp} />
      )}
    </Container>
  );
};

const lightReadOnlyFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "#f1f5ff",
    color: "#0f172a",
    "& fieldset": {
      borderColor: "#bfdbfe",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#1e3a8a",
    fontWeight: 600,
  },
  "& input": {
    cursor: "default",
  },
};

const lightTextFieldSx = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    backgroundColor: "#ffffff",
    color: "#0f172a",
    "& fieldset": {
      borderColor: "#93c5fd",
    },
    "&:hover fieldset": {
      borderColor: "#3b82f6",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#1e3a8a",
    fontWeight: 600,
  },
};

//---------------TABLE---------------

function ViewBudgetaryQuotationData(props) {
  console.log("props viewBudgetaryQuotationData", props.ViewData.data);

  // ---------------- STATES ----------------
  const data = Array.isArray(props.ViewData.data) ? props.ViewData : [];
  const [searchTerm, setSearchTerm] = useState("");
  const [defenceFilter, setDefenceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRow, setSelectedRow] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // READ-ONLY VIEW DIALOG STATE
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewRow, setViewRow] = useState(null);

  // ---------------- HANDLERS ----------------
  const STATUS_OPTIONS = [
    "Draft",
    "Submitted",
    "In Progress",
    "Under Review",
    "Won",
    "Lost",
    "On Hold",
  ];

  const TENDER_TYPE_OPTIONS = ["ST", "MT", "Nom", "LT"];

  // Search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Defence Filter
  const handleDefenceFilterChange = (e) => {
    setDefenceFilter(e.target.value);
  };

  // Status Filter
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Sort By
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  // Toggle ASC / DESC
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDefenceFilter("all");
    setStatusFilter("all");
    setSortBy("dateCreated");
    setSortDirection("desc");
  };

  // DOWNLOAD ALL DATA AS EXCEL
  const handleDownloadAllData = () => {
    console.log(" data for download : ", data);
    if (!data || data.length === 0) {
      alert("No data available to download");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lead_Submitted");

    XLSX.writeFile(
      workbook,
      `Lead_Submitted_Data_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // Row Selection
  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  // OPEN EDIT DIALOG
  const handleEditClick = (row) => {
    setEditingRow({ ...row });
    setEditDialogOpen(true);
  };

  // UPDATE FIELD WHILE EDITING
  const handleEditFieldChange = (field, value) => {
    setEditingRow((prev) => ({ ...prev, [field]: value }));
  };

  // CANCEL EDIT
  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingRow(null);
  };

  // SAVE EDITED VALUES
  const handleEditSave = () => {
    console.log("Saving updated row:", editingRow);

    // TODO: update in backend or props function

    setEditDialogOpen(false);
  };

  // DELETE ROW
  const handleDeleteClick = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    console.log("Deleting row with ID:", id);

    // TODO: delete logic here
  };

  // DOUBLE CLICK → OPEN READ-ONLY VIEW
  const handleRowDoubleClick = (row) => {
    setViewRow(row);
    setViewDialogOpen(true);
  };

  // ===== TABLE STYLES =====
  const headerCellStyle = {
    fontWeight: 800,
    fontSize: 13,
    color: "#ecfeff",
    background:
      // "linear-gradient(175deg, #051650 85%, #023e8a 50%, #0077B6 20%)",
      "#023e8a",
    borderBottom: "none",
    whiteSpace: "nowrap",
  };

  const bodyCellStyle = {
    fontSize: 13,
    color: "#111827",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  };

  const ellipsisCell = {
    ...bodyCellStyle,
    maxWidth: 180,
  };

  const actionHeaderStyle = {
    ...headerCellStyle,
    textAlign: "center",
  };

  const filterSx = {
    minWidth: 180,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 2.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      "& fieldset": {
        borderColor: "rgba(148,163,184,0.6)",
      },
      "&:hover fieldset": {
        borderColor: "#3b82f6",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#2563eb",
        boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
      },
    },
  };

  return (
    <>
      {/* ================= HEADER + CONTROLS ================= */}
      <Box sx={{ mt: -4, mb: 4, px: { xs: 1, sm: 0 } }}>
        <Paper
          elevation={8}
          sx={{
            borderRadius: 3,
            p: { xs: 2.5, sm: 3.5 },
            background:
              "linear-gradient(135deg, #e0f7ff 0%, #c8f0ff 45%, #a6e9ff 100%)",
            color: "#06283D",
            boxShadow: "0 20px 40px rgba(6,40,61,0.15)",
          }}
        >
          {/* -------- TITLE + SEARCH -------- */}
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
                  fontWeight: 900,
                  letterSpacing: 0.4,
                  mb: 0.5,
                }}
              >
                Budgetary Quotation Data View
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#0f3c5f",
                  opacity: 0.85,
                  maxWidth: 520,
                }}
              >
                Search, filter and manage all quotations in one place
              </Typography>
            </Box>

            {/* SEARCH */}
            <TextField
              size="small"
              placeholder="Search by title, customer, reference..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ color: "#1e40af" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "100%", sm: 300, md: 340 },
                backgroundColor: "rgba(255,255,255,0.95)",
                borderRadius: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  "& fieldset": {
                    borderColor: "rgba(148,163,184,0.6)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#3b82f6",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#2563eb",
                    boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
                  },
                },
              }}
            />
          </Box>

          {/* -------- FILTERS + ACTIONS -------- */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              alignItems: "center",
            }}
          >
            {/* DEFENCE FILTER */}
            <TextField
              select
              size="small"
              label="Defence / Non Defence"
              value={defenceFilter}
              onChange={handleDefenceFilterChange}
              sx={filterSx}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Defence">Defence</MenuItem>
              <MenuItem value="Non Defence">Non Defence</MenuItem>
            </TextField>

            {/* STATUS FILTER */}
            <TextField
              select
              size="small"
              label="Present Status"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              sx={filterSx}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </TextField>

            {/* SORT BY */}
            <TextField
              select
              size="small"
              label="Sort by"
              value={sortBy}
              onChange={handleSortByChange}
              sx={filterSx}
            >
              <MenuItem value="dateCreated">Created Date</MenuItem>
              <MenuItem value="dateOfLetterSubmission">
                Letter Submission Date
              </MenuItem>
              <MenuItem value="estimateValueInCrWithoutGST">
                Estimate Value
              </MenuItem>
              <MenuItem value="submittedValueInCrWithoutGST">
                Submitted Value
              </MenuItem>
            </TextField>

            {/* SORT DIRECTION */}
            <Tooltip
              title={`Sort ${
                sortDirection === "asc" ? "Descending" : "Ascending"
              }`}
            >
              <IconButton
                onClick={toggleSortDirection}
                sx={{
                  borderRadius: 2.5,
                  border: "1px solid rgba(148,163,184,0.7)",
                  backgroundColor: "rgba(255,255,255,0.9)",
                  "&:hover": {
                    backgroundColor: "#e0f2fe",
                  },
                }}
              >
                {sortDirection === "asc" ? <SouthRounded /> : <NorthRounded />}
              </IconButton>
            </Tooltip>

            {/* DOWNLOAD BUTTON – COMMENTED AS REQUESTED */}
            {/*
      <Button
        variant="contained"
        onClick={handleDownloadAllData}
        sx={{
          borderRadius: 999,
          background: "linear-gradient(135deg,#16a34a,#22c55e)",
          color: "#fff",
          textTransform: "none",
          px: 3,
          fontWeight: 700,
        }}
      >
        Download All Data
      </Button>
      */}

            {/* RESET */}
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
                fontWeight: 600,
                backgroundColor: "rgba(255,255,255,0.9)",
                "&:hover": {
                  backgroundColor: "#d0eaff",
                  borderColor: "#0A3C7D",
                },
              }}
            >
              Reset
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* TABLE */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1800px", // ⬅️ Increased table width
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
            maxHeight: "50vh",
            minWidth: "100%",
          }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              borderCollapse: "separate",
              borderSpacing: 0,
              "& th, & td": {
                borderRight: "1px solid rgba(203,213,225,0.8)",
              },
              "& th:last-child, & td:last-child": {
                borderRight: "none",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={headerCellStyle}>Bq Title</TableCell>
                <TableCell sx={headerCellStyle}>Customer Name</TableCell>
                <TableCell sx={{ ...headerCellStyle, minWidth: 200 }}>
                  Customer Address
                </TableCell>
                <TableCell sx={headerCellStyle}>Lead Owner</TableCell>
                <TableCell sx={headerCellStyle}>
                  Defence / Non Defence
                </TableCell>
                <TableCell sx={headerCellStyle}>
                  Estimate (CR, w/o GST)
                </TableCell>
                <TableCell sx={headerCellStyle}>
                  Submitted (CR, w/o GST)
                </TableCell>
                <TableCell sx={headerCellStyle}>
                  Letter Submission Date
                </TableCell>
                <TableCell sx={headerCellStyle}>Reference No</TableCell>
                <TableCell sx={headerCellStyle}>Competitors</TableCell>
                <TableCell sx={headerCellStyle}>Remarks</TableCell>
                <TableCell sx={headerCellStyle}>Present Status</TableCell>
                <TableCell sx={headerCellStyle}>Created Date</TableCell>
                <TableCell sx={actionHeaderStyle}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {props.ViewData.data &&
                props.ViewData.data.length > 0 &&
                props.ViewData.data
                  .filter((row) => {
                    const q = searchTerm.toLowerCase();
                    const matchesSearch =
                      !q ||
                      row.bqTitle?.toLowerCase().includes(q) ||
                      row.customerName?.toLowerCase().includes(q) ||
                      row.referenceNo?.toLowerCase().includes(q) ||
                      row.leadOwner?.toLowerCase().includes(q) ||
                      row.customerAddress?.toLowerCase().includes(q);

                    const matchesDefence =
                      defenceFilter === "all" ||
                      row.defenceAndNonDefence === defenceFilter;

                    const matchesStatus =
                      statusFilter === "all" ||
                      row.presentStatus?.toLowerCase() ===
                        statusFilter.toLowerCase();

                    return matchesSearch && matchesDefence && matchesStatus;
                  })
                  .sort((a, b) => {
                    let aVal;
                    let bVal;

                    switch (sortBy) {
                      case "dateOfLetterSubmission":
                        aVal = a.dateOfLetterSubmission || "";
                        bVal = b.dateOfLetterSubmission || "";
                        break;
                      case "estimateValueInCrWithoutGST":
                        aVal = parseFloat(a.estimateValueInCrWithoutGST) || 0;
                        bVal = parseFloat(b.estimateValueInCrWithoutGST) || 0;
                        break;
                      case "submittedValueInCrWithoutGST":
                        aVal = parseFloat(a.submittedValueInCrWithoutGST) || 0;
                        bVal = parseFloat(b.submittedValueInCrWithoutGST) || 0;
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
                      onDoubleClick={() => handleRowDoubleClick(row)}
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
                        {row.bqTitle}
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
                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.leadOwner}
                      </TableCell>
                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        <Chip
                          size="small"
                          label={row.defenceAndNonDefence || "-"}
                          sx={{
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            backgroundColor:
                              row.defenceAndNonDefence === "Defence"
                                ? "rgba(22,163,74,0.12)"
                                : "rgba(59,130,246,0.12)",
                            color:
                              row.defenceAndNonDefence === "Defence"
                                ? "#15803d"
                                : "#1d4ed8",
                          }}
                        />
                      </TableCell>
                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.estimateValueInCrWithoutGST}
                      </TableCell>
                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.submittedValueInCrWithoutGST}
                      </TableCell>
                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        {row.dateOfLetterSubmission}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontSize: 13,
                          maxWidth: 160,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.referenceNo}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontSize: 13,
                          maxWidth: 180,
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                      >
                        {row.JSON_competitors}
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
                        {row.remarks}
                      </TableCell>
                      <TableCell align="left" sx={{ fontSize: 13 }}>
                        <Chip
                          size="small"
                          label={row.presentStatus || "-"}
                          sx={{
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            backgroundColor:
                              row.presentStatus === "Closed"
                                ? "rgba(248,113,113,0.18)"
                                : row.presentStatus === "In Progress"
                                ? "rgba(234,179,8,0.18)"
                                : "rgba(52,211,153,0.18)",
                            color:
                              row.presentStatus === "Closed"
                                ? "#b91c1c"
                                : row.presentStatus === "In Progress"
                                ? "#92400e"
                                : "#15803d",
                          }}
                        />
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(row);
                              }}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(row.id);
                              }}
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
                  <TableCell colSpan={15} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#6b7280" }}>
                      No profiles found.
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
              "linear-gradient(135deg, #f8fbff 0%, #eef5ff 50%, #e3eeff 100%)",
            color: "#0f172a",
            boxShadow: "0 25px 60px rgba(59,130,246,0.25)",
          },
        }}
      >
        {/* ---------------- TITLE ---------------- */}
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            color: "#0d47a1",
            background: "linear-gradient(90deg,#e3f2fd,#f8fbff)",
          }}
        >
          Edit Lead Submission
          <IconButton
            onClick={handleEditCancel}
            sx={{
              color: "#1e40af",
              "&:hover": { backgroundColor: "rgba(59,130,246,0.15)" },
            }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        {/* ---------------- CONTENT ---------------- */}
        <DialogContent
          dividers
          sx={{
            background: "#f8fbff",
            borderColor: "rgba(59,130,246,0.25)",
            px: 3,
            py: 2.5,
          }}
        >
          {/* bqTitle: "",
      customerName: "",
      customerAddress: "",
      leadOwner: "",
      defenceAndNonDefence: "",
      estimateValueInCrWithoutGST: "",
      submittedValueInCrWithoutGST: "",
      dateOfLetterSubmission: "",
      referenceNo: "",
      JSON_competitors: "",
      presentStatus: "", */}
          <Grid container spacing={2}>
            {[
              ["Tender Name", "bqTitle"],
              ["Customer Name", "customerName"],
              ["Customer Address", "customerAddress", true],
              ["Lead Owner", "leadOwner"],
              ["Defence/Non-Defence", "defenceAndNonDefence", false, "date"],
              [
                "Estimate Value In Cr Without GST",
                "estimateValueInCrWithoutGST",
                false,
                "date",
              ],
              [
                "Submitted Value In Cr Without GST",
                "rfpDueDate",
                false,
                "date",
              ],
              ["EMD Value (Cr)", "valueEMDInCrore"],
              ["Tender Reference No", "tenderReferenceNo"],
              ["Website", "website"],
            ].map(([label, field, multiline, type], idx) => (
              <Grid item xs={12} md={multiline ? 12 : 6} key={idx}>
                <TextField
                  label={label}
                  type={type || "text"}
                  value={editingRow?.[field] || ""}
                  onChange={(e) => handleEditFieldChange(field, e.target.value)}
                  fullWidth
                  size="small"
                  multiline={!!multiline}
                  minRows={multiline ? 2 : undefined}
                  InputLabelProps={
                    type === "date" ? { shrink: true } : undefined
                  }
                  sx={lightTextFieldSx}
                />
              </Grid>
            ))}

            {/* Tender Type */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Tender Type"
                value={editingRow?.tenderType || ""}
                onChange={(e) =>
                  handleEditFieldChange("tenderType", e.target.value)
                }
                fullWidth
                size="small"
                sx={lightTextFieldSx}
              >
                {TENDER_TYPE_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Present Status */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Present Status"
                value={editingRow?.presentStatus || ""}
                onChange={(e) =>
                  handleEditFieldChange("presentStatus", e.target.value)
                }
                fullWidth
                size="small"
                sx={lightTextFieldSx}
              >
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        {/* ---------------- ACTIONS ---------------- */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            background: "#f1f5ff",
            borderTop: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          <Button
            onClick={handleEditCancel}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 3,
              fontWeight: 600,
              color: "#1e40af",
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
              px: 4,
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#2563eb 0%,#3b82f6 50%,#1d4ed8 100%)",
              boxShadow: "0 10px 25px rgba(59,130,246,0.45)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#1d4ed8 0%,#2563eb 50%,#1e40af 100%)",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* READ-ONLY VIEW DIALOG */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #f8fbff 0%, #eef5ff 50%, #e3eeff 100%)",
            color: "#0f172a",
            boxShadow: "0 25px 60px rgba(59,130,246,0.25)",
          },
        }}
      >
        {/* ---------------- TITLE ---------------- */}
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            color: "#0d47a1",
            background: "linear-gradient(90deg,#e3f2fd,#f8fbff)",
          }}
        >
          Budgetary Quotation – View Only
          <IconButton
            onClick={() => setViewDialogOpen(false)}
            sx={{
              color: "#1e40af",
              "&:hover": { backgroundColor: "rgba(59,130,246,0.15)" },
            }}
          >
            <CloseRounded />
          </IconButton>
        </DialogTitle>

        {/* ---------------- CONTENT ---------------- */}
        <DialogContent
          dividers
          sx={{
            background: "#f8fbff",
            borderColor: "rgba(59,130,246,0.25)",
            px: 3,
            py: 2.5,
          }}
        >
          {viewRow && (
            <Grid container spacing={2}>
              {Object.entries(viewRow).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    label={key}
                    value={value ?? ""}
                    fullWidth
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={lightReadOnlyFieldSx}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </DialogContent>

        {/* ---------------- ACTIONS ---------------- */}
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            background: "#f1f5ff",
            borderTop: "1px solid rgba(59,130,246,0.25)",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setViewDialogOpen(false)}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              px: 4,
              fontWeight: 700,
              background:
                "linear-gradient(135deg,#2563eb 0%,#3b82f6 50%,#1d4ed8 100%)",
              boxShadow: "0 10px 25px rgba(59,130,246,0.45)",
              "&:hover": {
                background:
                  "linear-gradient(135deg,#1d4ed8 0%,#2563eb 50%,#1e40af 100%)",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

//-----------Bulk Upload-----------
function ExcelUploadAndValidate({ user, ServerIp }) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const DB_COLUMNS = [
    "bqTitle",
    "customerName",
    "customerAddress",
    "leadOwner",
    "defenceAndNonDefence",
    "estimateValueInCrWithoutGST",
    "submittedValueInCrWithoutGST",
    "dateOfLetterSubmission",
    "referenceNo",
    "JSON_competitors",
    "presentStatus",
    // user info
    "OperatorId",
    "OperatorName",
    "OperatorRole",
    "OperatorSBU",
  ];

  const DB_COLUMNS_MATCH = [
    "bqTitle",
    "customerName",
    "customerAddress",
    "leadOwner",
    "defenceAndNonDefence",
    "estimateValueInCrWithoutGST",
    "submittedValueInCrWithoutGST",
    "dateOfLetterSubmission",
    "referenceNo",
    "JSON_competitors",
    "presentStatus",
  ];

  // ----------------------------
  // HANDLE FILE UPLOAD
  // ----------------------------
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError("");
    setSuccess("");

    //bqTitle	customerName	customerAddress	leadOwner	defenceAndNonDefence	estimateValueInCrWithoutGST	submittedValueInCrWithoutGST	dateOfLetterSubmission	referenceNo	JSON_competitors	presentStatus

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert Excel to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length === 0) {
        setError("Excel file is empty.");
        return;
      }

      const excelColumns = jsonData[0].map((col) => col.toString().trim());

      // Validate columns
      const missing = DB_COLUMNS_MATCH.filter(
        (col) => !excelColumns.includes(col)
      );
      const extra = excelColumns.filter(
        (col) => !DB_COLUMNS_MATCH.includes(col)
      );

      if (missing.length > 0 || extra.length > 0) {
        setError(
          `Column mismatch!
          Missing : ${missing.join(", ") || "None"}; 
          Extra : ${extra.join(", ") || "None"}`
        );
        return;
      }

      // Remove header & extract data rows

      console.log("jsonData from browse", jsonData);
      const rows = jsonData.slice(1).map((row) => {
        const rowObj = {};
        DB_COLUMNS.forEach((col, index) => {
          if (col === "") {
            setError(`This field is blank`);
            return;
          }
          if (col === "OperatorId") {
            rowObj[col] = user?.id || "291536";
            return;
          }

          if (col === "OperatorName") {
            rowObj[col] = user?.username;
            return;
          }

          if (col === "OperatorRole") {
            rowObj[col] = user?.userRole;
            return;
          }

          if (col === "OperatorSBU") {
            rowObj[col] = "Software SBU";
            return;
          } else {
            rowObj[col] = row[index] || "";
          }
        });
        return rowObj;
      });

      setExcelData(rows);
      setSuccess(`File validated successfully. Total rows: ${rows.length}`);
    };
    console.log(excelData);

    reader.readAsArrayBuffer(file);
  };

  // ----------------------------
  // SEND TO BACKEND
  // ----------------------------
  const handleUploadToServer = async () => {
    if (excelData.length === 0) {
      setError("No valid data found to upload.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    // setExcelData(...excelData, {
    //   OperatorId: user.id || "291536",
    //   OperatorName: user.username || "Vivek Kumar Singh",
    //   OperatorRole: user.userRole || "Lead Owner",
    //   OperatorSBU: "Software SBU",
    // })

    // VIEW FINALLY THE DATA IS GOING TO BACKEND
    console.log(
      "VIEW FINAL DATA IS GOING INTO BACKEND : ",
      excelData,
      "ServerIP : ",
      ServerIp
    );

    // HERE WE ARE CALLING THE API TO BULK UPLOAD
    axios
      .post(ServerIp + "/bqbulkUpload", { excelData })
      .then((response) => {
        console.log("Server response : ", response);
        if (response) {
          setSuccess("Data successfully pushed into the database!");
        } else {
          setError(response?.data || "Failed to upload data.");
        }
      })
      .catch((error) => {
        console.log(error.message);
        setError("Server error: " + error.message);
      })
      .finally(() => {
        console.log(" finally is hitted");
      });

    setLoading(false);
  };

  return (
    <Box
      sx={{
        mt: -4,
        minHeight: "50vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #eef5ff 0%, #f8fbff 100%)",
        borderRadius: 4,
        p: 3,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 720,
          p: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
        }}
      >
        {/* TITLE */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            textAlign: "center",
            color: "#0d47a1",
            mb: 1,
          }}
        >
          Upload Budgetary Quotation Data
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "#64748b",
            mb: 3,
          }}
        >
          Upload Excel file (.xlsx / .xls) to bulk insert records into the
          system
        </Typography>

        {/* UPLOAD BOX */}
        {excelData.length === 0 && (
          <Box
            sx={{
              border: "2px dashed #93c5fd",
              borderRadius: 4,
              p: { xs: 4, sm: 6 }, // ⬅️ MORE INNER SPACE
              minHeight: 280, // ⬅️ INCREASED HEIGHT

              textAlign: "center",
              background: "linear-gradient(180deg, #f8fbff 0%, #eef5ff 100%)",
              transition: "all 0.25s ease",
              "&:hover": {
                background: "linear-gradient(180deg, #eef5ff 0%, #e0f2fe 100%)",
                borderColor: "#3b82f6",
                boxShadow: "0 10px 30px rgba(59,130,246,0.15)",
              },
            }}
          >
            {/* ICON */}
            <Box
              sx={{
                mb: 2,
                animation: "float 3s ease-in-out infinite",
                "@keyframes float": {
                  "0%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-8px)" },
                  "100%": { transform: "translateY(0px)" },
                },
              }}
            >
              <CloudQueueRoundedIcon
                sx={{
                  fontSize: 64,
                  background: "linear-gradient(135deg, #93c5fd, #3b82f6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 8px 16px rgba(59,130,246,0.35))",
                }}
              />
            </Box>

            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}
            >
              Drag & drop your file here
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
              or click to browse (.xlsx or .xls)
            </Typography>

            {/* BROWSE FILE BUTTON */}
            <Button
              variant="contained"
              component="label"
              sx={{
                borderRadius: 999,
                px: 4,
                py: 1.2,
                fontWeight: 700,
                fontSize: 14,
                textTransform: "none",
                color: "#ffffff",

                background:
                  "linear-gradient(135deg, #42a5f5 0%, #2563eb 50%, #1e40af 100%)",
                boxShadow: "0 8px 22px rgba(37,99,235,0.35)",

                transition: "all 0.25s ease",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%)",
                  boxShadow: "0 14px 32px rgba(37,99,235,0.45)",
                  transform: "translateY(-2px) scale(1.03)",
                },

                "&:active": {
                  transform: "scale(0.96)",
                  boxShadow: "0 6px 14px rgba(37,99,235,0.35)",
                },
              }}
            >
              📁 Browse File
              <input
                type="file"
                accept=".xlsx,.xls"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
          </Box>
        )}

        {/* STATUS MESSAGES */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {success}
          </Alert>
        )}

        {/* PUSH BUTTON (UNCHANGED LOGIC) */}
        {excelData.length > 0 && (
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleUploadToServer}
              disabled={loading}
              sx={{
                px: 5,
                py: 1.4,
                borderRadius: 999,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "0 8px 20px rgba(22,163,74,0.35)",
              }}
            >
              {loading ? (
                <CircularProgress size={26} sx={{ color: "#fff" }} />
              ) : (
                "Push Data to Database"
              )}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default BudgetaryQuotationForm;
