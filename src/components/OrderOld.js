// OrderReceivedForm.js
// Regenerated UI cloned from BudgetaryQuotationForm.js theme.
// View includes: Search, Filters (Contract Name text, Customer Name text, Type of Tender select, Date range), Value range, Sorting, Pagination.
// Reference: BudgetaryQuotationForm.js :contentReference[oaicite:1]{index=1}

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Container,
  Tabs,
  Tab,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Grid,
  Button,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  InputAdornment,
  Select,
  FormControl,
  Pagination,
  Slider,
} from "@mui/material";

import {
  SearchRounded,
  NorthRounded,
  SouthRounded,
  RestartAltRounded,
  DownloadRounded,
  FilterListRounded,
} from "@mui/icons-material";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import dayjs from "dayjs";

/* -------------------------
   OPTIONS & CONSTANTS
   ------------------------- */
const orderTypes = ["ST", "MT"];
const DEFAULT_PAGE_SIZE = 10;

/* -------------------------
   MAIN COMPONENT
   ------------------------- */
export default function OrderReceivedForm() {
  // form + UI states
  const [value, setValue] = useState(0); // tabs
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [browsefile, setBrowsefile] = useState(null);
  const [uploadFileData, setUploadFileData] = useState(null);

  const [orderData, setOrderData] = useState([]); // backend fetched
  const [ServerIp, SetServerIp] = useState("");
  const [SaveDataHardDiskURL, SetSaveDataHardDiskURL] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [presentDate, setPresentDate] = useState(new Date());

  // VIEW filters/sort/pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterContract, setFilterContract] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateFrom, setDateFrom] = useState(""); // YYYY-MM-DD
  const [dateTo, setDateTo] = useState("");
  const [valueRange, setValueRange] = useState([0, 100]); // in crores (user friendly)
  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // config + user
  let user = JSON.parse(localStorage.getItem("user")) || {};

  /* -------------------------
     react-hook-form setup
     ------------------------- */
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contractName: "",
      customerName: "",
      customerAddress: "",
      orderReceivedDate: "",
      purchaseOrder: "",
      typeOfTender: "",
      valueWithoutGST: "",
      valueWithGST: "",
      JSON_competitors: "",
      remarks: "",
      contractCopy: "",
      fileName: "",
      filePath: "",
      hardDiskFileName: "",
      Dom_or_Export: "1",
    },
  });

  const today = new Date().toLocaleDateString("en-CA");

  /* -------------------------
     fetch config + data
     ------------------------- */
  const API = "/getOrderReceived";
  const API2 = "/pdfupload";

  useEffect(() => {
    axios
      .get("/config.json")
      .then((resp) => {
        const base = resp.data.project[0].ServerIP[0].NodeServerIP;
        SetServerIp(base + API);
        SetSaveDataHardDiskURL(base + API2);
        // fetch orders
        return axios.get(base + API);
      })
      .then((res) => {
        setOrderData(res.data || []);
      })
      .catch((err) => {
        console.error("config.json / fetch error:", err?.message || err);
        // fallback: keep ServerIp blank; your original code used "172.195.120.135"
        SetServerIp("http://172.195.120.135" + API);
      });
  }, []);

  /* -------------------------
     form submit handler
     ------------------------- */
  const onSubmit = (data) => {
    // format data
    const formattedData = {
      contractName: data.contractName,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      orderReceivedDate: data.orderReceivedDate,
      purchaseOrder: data.purchaseOrder,
      typeOfTender: data.typeOfTender,
      valueWithoutGST:
        data.valueWithoutGST !== ""
          ? parseFloat(parseFloat(data.valueWithoutGST).toFixed(2))
          : null,
      valueWithGST:
        data.valueWithGST !== ""
          ? parseFloat(parseFloat(data.valueWithGST).toFixed(2))
          : null,
      JSON_competitors: data.JSON_competitors,
      remarks: data.remarks,
      attachment: selectedFiles ? selectedFiles.name : "",
      submittedAt: new Date().toISOString(),
      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
      fileName: uploadFileData?.fileName,
      filePath: uploadFileData?.filePath,
      hardDiskFileName: uploadFileData?.hardDiskFileName,
      Dom_or_Export: "1",
    };

    console.log("Form Data:", JSON.stringify(formattedData, null, 2));

    axios
      .post(ServerIp, formattedData)
      .then((resp) => {
        console.log("Server response:", resp.data);
        setSubmittedData(formattedData);
        setSubmitSuccess(true);
        // optionally re-fetch dataset
      })
      .catch((err) => {
        console.error("submit error:", err?.message || err);
      });
  };

  /* -------------------------
     file handlers (pdf upload)
     ------------------------- */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(
      (file) => file.type.includes("pdf") || file.type.includes("image")
    );

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files");
      return;
    }

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const res = await fetch(ServerIp + "/pdfupload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Uploaded files:", data);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleReset = () => {
    reset();
    setSubmittedData(null);
    setSelectedFiles(null);
    setUploadFileData(null);
  };

  const handleCloseSnackbar = () => setSubmitSuccess(false);

  const handleDownloadJSON = () => {
    if (!submittedData) return;
    const s = JSON.stringify(submittedData, null, 2);
    const blob = new Blob([s], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `domestic-order-${
      submittedData.purchaseOrder || ""
    }-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* -------------------------
     VIEW: filter + sort + pagination logic
     ------------------------- */
  const valueMinMax = useMemo(() => {
    // compute value min/max from dataset (in crores)
    const vals = (orderData?.data || []).map((r) => {
      const v = parseFloat(r.valueWithoutGST || r.valueWithGST || 0);
      return isNaN(v) ? 0 : v;
    });
    const min = vals.length ? Math.min(...vals) : 0;
    const max = vals.length ? Math.max(...vals) : 100;
    return { min, max };
  }, [orderData]);

  // keep valueRange bounded to dataset range when data changes
  useEffect(() => {
    setValueRange([
      Math.floor(valueMinMax.min),
      Math.ceil(valueMinMax.max || 100),
    ]);
  }, [valueMinMax.min, valueMinMax.max]);

  const filteredRows = useMemo(() => {
    let rows = (orderData?.data || []).slice();

    // search
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      rows = rows.filter((r) => {
        return (
          (r.contractName || "").toString().toLowerCase().includes(q) ||
          (r.customerName || "").toString().toLowerCase().includes(q) ||
          (r.purchaseOrder || "").toString().toLowerCase().includes(q)
        );
      });
    }

    // contract filter
    if (filterContract.trim()) {
      const c = filterContract.toLowerCase();
      rows = rows.filter((r) =>
        (r.contractName || "").toLowerCase().includes(c)
      );
    }

    // customer filter
    if (filterCustomer.trim()) {
      const c = filterCustomer.toLowerCase();
      rows = rows.filter((r) =>
        (r.customerName || "").toLowerCase().includes(c)
      );
    }

    // type filter
    if (filterType !== "all") {
      rows = rows.filter((r) =>
        r.typeOfTender || r.typeOfTender === filterType
          ? r.typeOfTender === filterType
          : false
      );
    }

    // date range filter (orderReceivedDate)
    if (dateFrom) {
      rows = rows.filter((r) => {
        const d =
          r.orderReceivedDate ||
          r.orderReceicedDate ||
          r.orderReceievedDate ||
          "";
        if (!d) return false;
        return dayjs(d).isSameOrAfter(dayjs(dateFrom));
      });
    }
    if (dateTo) {
      rows = rows.filter((r) => {
        const d =
          r.orderReceivedDate ||
          r.orderReceicedDate ||
          r.orderReceievedDate ||
          "";
        if (!d) return false;
        return dayjs(d).isSameOrBefore(dayjs(dateTo));
      });
    }

    // value range filter (use valueWithoutGST primarily)
    rows = rows.filter((r) => {
      const v = parseFloat(r.valueWithoutGST || r.valueWithGST || 0);
      if (isNaN(v)) return false;
      return v >= valueRange[0] && v <= valueRange[1];
    });

    // sort
    rows.sort((a, b) => {
      let aVal = a[sortBy] ?? "";
      let bVal = b[sortBy] ?? "";

      // try parse as number or date
      if (!isNaN(Date.parse(aVal))) aVal = new Date(aVal).getTime();
      if (!isNaN(Date.parse(bVal))) bVal = new Date(bVal).getTime();

      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        if (aNum < bNum) return sortDirection === "asc" ? -1 : 1;
        if (aNum > bNum) return sortDirection === "asc" ? 1 : -1;
        return 0;
      }

      aVal = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      bVal = typeof bVal === "string" ? bVal.toLowerCase() : bVal;

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [
    orderData,
    searchTerm,
    filterContract,
    filterCustomer,
    filterType,
    dateFrom,
    dateTo,
    valueRange,
    sortBy,
    sortDirection,
  ]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  /* -------------------------
     UI: render
     ------------------------- */
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 5,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd 0%, #f8fbff 100%)",
        borderRadius: 2,
      }}
    >
      {/* Tabs */}
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
          "& .Mui-selected": { color: "#0d47a1 !important" },
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

      {/* ---------------- CREATE FORM ---------------- */}
      {value === 0 && (
        <Paper
          elevation={10}
          sx={{
            p: { xs: 2, md: 5 },
            borderRadius: 4,
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Domestic Order Received Form
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.7, mt: 1 }}>
              Complete required fields to submit order information
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Order Details Card */}
            <Card sx={cardStyle()}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📋 Order Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="contractName"
                      control={control}
                      rules={{ required: "Contract Name is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Contract Name"
                          fullWidth
                          required
                          error={!!errors.contractName}
                          helperText={errors.contractName?.message}
                          sx={inputStyle()}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="orderReceivedDate"
                      control={control}
                      rules={{ required: "Order Received Date is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Order Received Date"
                          type="date"
                          fullWidth
                          required
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.orderReceivedDate}
                          helperText={errors.orderReceivedDate?.message}
                          sx={inputStyle()}
                          inputProps={{
                            max: today, // ✅ disables future dates, allows today & past
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="purchaseOrder"
                      control={control}
                      rules={{
                        required:
                          "Purchase Order/Work Order Number is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Purchase Order / Work Order Number"
                          fullWidth
                          required
                          error={!!errors.purchaseOrder}
                          helperText={errors.purchaseOrder?.message}
                          sx={inputStyle()}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Customer Info Card */}
            <Card sx={cardStyle()}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  👤 Customer Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
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
                          sx={inputStyle()}
                        />
                      )}
                    />
                  </Grid>

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
                          multiline
                          rows={3}
                          error={!!errors.customerAddress}
                          helperText={errors.customerAddress?.message}
                          sx={inputStyle()}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Document Info Card */}
            <Card sx={cardStyle()}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📄 Document Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="typeOfTender"
                      control={control}
                      rules={{ required: "Order Type is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Order Type"
                          fullWidth
                          required
                          error={!!errors.typeOfTender}
                          helperText={errors.typeOfTender?.message}
                          sx={inputStyle()}
                        >
                          {orderTypes.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Financial Details Card */}
            <Card sx={cardStyle()}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  💰 Financial Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter value in crore e.g., 1.50">
                      <Controller
                        name="valueWithoutGST"
                        control={control}
                        rules={{
                          required: "Value without GST is required",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]{1,2})?$/,
                            message: "Enter valid number up to 2 decimals",
                          },
                          min: { value: 0.01, message: "Value must be > 0" },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Value without GST (in Crore)"
                            fullWidth
                            required
                            error={!!errors.valueWithoutGST}
                            helperText={
                              errors.valueWithoutGST?.message ||
                              "Enter value in crore"
                            }
                            sx={inputStyle()}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₹
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  Cr
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Tooltip>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Enter value in crore e.g., 1.77">
                      <Controller
                        name="valueWithGST"
                        control={control}
                        rules={{
                          required: "Value with GST is required",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]{1,2})?$/,
                            message: "Enter valid number up to 2 decimals",
                          },
                          min: { value: 0.01, message: "Value must be > 0" },
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Value with GST (in Crore)"
                            fullWidth
                            required
                            error={!!errors.valueWithGST}
                            helperText={
                              errors.valueWithGST?.message ||
                              "Enter value in crore"
                            }
                            sx={inputStyle()}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₹
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  Cr
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Competitors & Remarks */}
            <Card sx={cardStyle()}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  🏢 Competitors & Remarks
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
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
                          rows={3}
                          sx={inputStyle()}
                          helperText="Separate with commas"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Remarks (Optional)"
                          fullWidth
                          multiline
                          rows={4}
                          sx={inputStyle()}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card sx={cardStyle()}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#0d47a1", mb: 2 }}
                >
                  📎 Attachments
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Upload Contract Copy / Work Order / LOI (Optional)
                  </Typography>

                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ mt: 2, mr: 2 }}
                  >
                    Choose File
                    <input
                      type="file"
                      hidden
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                    />
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={handleFileUpload}
                  >
                    Upload File
                  </Button>

                  {selectedFiles.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {selectedFiles.map((file, index) => (
                        <Grid item xs={12} md={4} key={index}>
                          <Card
                            variant="outlined"
                            sx={{ p: 1, borderRadius: 2 }}
                          >
                            <Typography variant="body2" noWrap>
                              {file.name}
                            </Typography>

                            {file.type.includes("image") && (
                              <Box
                                component="img"
                                src={URL.createObjectURL(file)}
                                sx={{
                                  width: "100%",
                                  height: 120,
                                  objectFit: "cover",
                                  borderRadius: 1,
                                  mt: 1,
                                }}
                              />
                            )}

                            {file.type.includes("pdf") && (
                              <iframe
                                src={URL.createObjectURL(file)}
                                title={file.name}
                                style={{
                                  width: "100%",
                                  height: 120,
                                  border: "none",
                                  marginTop: 8,
                                }}
                              />
                            )}

                            <Button
                              size="small"
                              color="error"
                              sx={{ mt: 1 }}
                              onClick={() =>
                                setSelectedFiles((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                            >
                              Remove
                            </Button>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {selectedFiles && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={selectedFiles.name}
                        onDelete={() => setSelectedFiles(null)}
                        color="primary"
                        variant="outlined"
                        sx={{ maxWidth: "100%" }}
                      />
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ mt: 1, color: "text.secondary" }}
                      >
                        Size: {(selectedFiles.size / 1024).toFixed(2)} KB
                      </Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Actions */}
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 4 }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={primaryBtn()}
              >
                Submit Order
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={handleReset}
                sx={resetBtn()}
              >
                Reset Form
              </Button>
            </Box>
          </form>

          {/* Snackbar */}
          <Snackbar
            open={submitSuccess}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ fontSize: "1rem" }}
            >
              🎉 Form submitted successfully!
            </Alert>
          </Snackbar>

          {/* Submitted JSON */}
          {submittedData && (
            <Box sx={{ mt: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  📊 Submitted Data (JSON)
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleDownloadJSON}
                  size="small"
                  startIcon={<DownloadRounded />}
                >
                  Download JSON
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Paper
                sx={{
                  p: 3,
                  background: "#0d1117",
                  color: "#c9d1d9",
                  borderRadius: 3,
                  maxHeight: 500,
                  overflow: "auto",
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <pre style={{ margin: 0 }}>
                  {JSON.stringify(submittedData, null, 2)}
                </pre>
              </Paper>
            </Box>
          )}
        </Paper>
      )}

      {/* ---------------- VIEW DATA ---------------- */}
      {value === 1 && (
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          {/* Header + Controls */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  User Profile Created List
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
                  View, search, filter and manage orders.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search by tender, customer, ref..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
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
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterListRounded />}
                  onClick={() => {
                    /* focus filters area? */
                  }}
                  sx={{ borderRadius: 3 }}
                >
                  Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RestartAltRounded />}
                  onClick={() => {
                    setSearchTerm("");
                    setFilterContract("");
                    setFilterCustomer("");
                    setFilterType("all");
                    setDateFrom("");
                    setDateTo("");
                    setValueRange([
                      Math.floor(valueMinMax.min),
                      Math.ceil(valueMinMax.max || 100),
                    ]);
                    setSortBy("dateCreated");
                    setSortDirection("desc");
                  }}
                  sx={{ borderRadius: 3 }}
                >
                  Reset
                </Button>
              </Box>
            </Box>

            {/* Filters Panel */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <TextField
                size="small"
                placeholder="Filter Contract Name"
                value={filterContract}
                onChange={(e) => {
                  setFilterContract(e.target.value);
                  setPage(1);
                }}
                sx={{
                  minWidth: 200,
                  backgroundColor: "rgba(240,248,255,0.9)",
                  borderRadius: 2.5,
                }}
              />
              <TextField
                size="small"
                placeholder="Filter Customer Name"
                value={filterCustomer}
                onChange={(e) => {
                  setFilterCustomer(e.target.value);
                  setPage(1);
                }}
                sx={{
                  minWidth: 200,
                  backgroundColor: "rgba(240,248,255,0.9)",
                  borderRadius: 2.5,
                }}
              />

              <TextField
                select
                size="small"
                label="Type of Tender"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(1);
                }}
                sx={{
                  minWidth: 160,
                  backgroundColor: "rgba(240,248,255,0.9)",
                  borderRadius: 2.5,
                }}
              >
                <MenuItem value="all">All</MenuItem>
                {orderTypes.map((o) => (
                  <MenuItem value={o} key={o}>
                    {o}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                size="small"
                type="date"
                label="From"
                InputLabelProps={{ shrink: true }}
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                sx={{
                  minWidth: 150,
                  backgroundColor: "rgba(240,248,255,0.9)",
                  borderRadius: 2.5,
                }}
              />
              <TextField
                size="small"
                type="date"
                label="To"
                InputLabelProps={{ shrink: true }}
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                sx={{
                  minWidth: 150,
                  backgroundColor: "rgba(240,248,255,0.9)",
                  borderRadius: 2.5,
                }}
              />

              <Box sx={{ minWidth: 220 }}>
                <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                  Value Range (Cr)
                </Typography>
                <Slider
                  value={valueRange}
                  onChange={(e, v) => {
                    setValueRange(v);
                    setPage(1);
                  }}
                  valueLabelDisplay="auto"
                  min={Math.floor(valueMinMax.min)}
                  max={Math.ceil(valueMinMax.max || 100)}
                />
              </Box>

              <TextField
                select
                size="small"
                label="Sort by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  minWidth: 200,
                  backgroundColor: "rgba(240,248,255,0.9)",
                  borderRadius: 2.5,
                }}
              >
                <MenuItem value="dateCreated">Created Date</MenuItem>
                <MenuItem value="orderReceivedDate">
                  Order Received Date
                </MenuItem>
                <MenuItem value="valueWithoutGST">Estimate Value</MenuItem>
                <MenuItem value="customerName">Customer Name</MenuItem>
              </TextField>

              <Tooltip
                title={`Sort ${
                  sortDirection === "asc" ? "Descending" : "Ascending"
                }`}
              >
                <IconButton
                  onClick={() =>
                    setSortDirection((s) => (s === "asc" ? "desc" : "asc"))
                  }
                  sx={{
                    borderRadius: 2.5,
                    border: "1px solid rgba(148,163,184,0.7)",
                    backgroundColor: "rgba(240,248,255,0.9)",
                  }}
                >
                  {sortDirection === "asc" ? (
                    <SouthRounded />
                  ) : (
                    <NorthRounded />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Table */}
          <Box sx={{ mt: 2 }}>
            <TableContainer
              component={Paper}
              sx={{ borderRadius: 3, boxShadow: 8, maxHeight: "65vh" }}
            >
              <Table
                stickyHeader
                size="small"
                aria-label="order received table"
              >
                <TableHead>
                  <TableRow>
                    {[
                      { label: "Contract Name", key: "contractName" },
                      { label: "Customer Name", key: "customerName" },
                      {
                        label: "Order Received Date",
                        key: "orderReceivedDate",
                      },
                      { label: "Purchase Order", key: "purchaseOrder" },
                      { label: "Type", key: "typeOfTender" },
                      { label: "Value (w/o GST)", key: "valueWithoutGST" },
                      { label: "Value (with GST)", key: "valueWithGST" },
                      { label: "Competitors", key: "JSON_competitors" },
                      { label: "Remarks", key: "remarks" },
                      { label: "Created", key: "dateCreated" },
                    ].map((col) => (
                      <TableCell
                        key={col.key}
                        sx={{
                          fontWeight: 800,
                          fontSize: 13,
                          color: "#f9fafb",
                          background:
                            "linear-gradient(90deg,#0ea5e9 0%,#2563eb 50%,#4f46e5 100%)",
                        }}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {paginatedRows.map((row, idx) => (
                    <TableRow key={row.id || row._id || idx} hover>
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.contractName}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {row.customerName}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {row.orderReceivedDate || row.orderReceicedDate || "-"}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {row.purchaseOrder}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        <Chip
                          size="small"
                          label={row.typeOfTender || "-"}
                          sx={{ borderRadius: 999 }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {row.valueWithoutGST}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {row.valueWithGST}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 13,
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.JSON_competitors}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 13,
                          maxWidth: 220,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.remarks}
                      </TableCell>
                      <TableCell sx={{ fontSize: 13 }}>
                        {row.dateCreated}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* empty state */}
                  {paginatedRows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                        <Typography variant="body1" sx={{ color: "#6b7280" }}>
                          No orders found for given filters.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination + page size */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 2,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {filteredRows.length} result(s)
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl size="small">
                  <Select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    sx={{ minWidth: 80 }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>

                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(e, p) => setPage(p)}
                  color="primary"
                />
              </Stack>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

/* -------------------------
   Helper styles (reused to match BQ theme)
   ------------------------- */
function cardStyle() {
  return {
    mb: 4,
    p: 3,
    borderRadius: 4,
    background: "rgba(250,250,255,0.9)",
    backdropFilter: "blur(10px)",
    transition: "0.3s",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    },
  };
}

function inputStyle() {
  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      "&:hover": { boxShadow: "0 0 10px #bbdefb" },
      "&.Mui-focused": { boxShadow: "0 0 15px #90caf9" },
    },
  };
}

function primaryBtn() {
  return {
    px: 6,
    py: 1.6,
    fontSize: "1.05rem",
    borderRadius: 3,
    fontWeight: 700,
    background: "linear-gradient(90deg, #1565c0, #42a5f5)",
    textTransform: "none",
    "&:hover": {
      transform: "scale(1.03)",
      background: "linear-gradient(90deg, #0d47a1, #1e88e5)",
    },
  };
}

function resetBtn() {
  return {
    px: 6,
    py: 1.6,
    fontSize: "1.05rem",
    borderRadius: 3,
    fontWeight: 700,
    textTransform: "none",
    "&:hover": { transform: "scale(1.02)", background: "#f4f6fb" },
  };
}
