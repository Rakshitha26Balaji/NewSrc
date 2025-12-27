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
  Checkbox,
  Menu,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import * as XLSX from "xlsx";

import {
  SearchRounded,
  NorthRounded,
  SouthRounded,
  RestartAltRounded,
  EditRounded,
  DeleteRounded,
} from "@mui/icons-material";

// import { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloudQueueRoundedIcon from "@mui/icons-material/CloudQueueRounded";

const BudgetaryQuotationForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadFileData, setuploadFileData] = useState(null);

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
       attachment: selectedFiles.map((f) => f.name),
  fileName: uploadFileData?.fileName,
  filePath: uploadFileData?.filePath,
  hardDiskFileName: uploadFileData?.hardDiskFileName,
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(
      (file) =>
        file.type.includes("pdf") ||
        file.type.includes("image") ||
        file.type.includes("sheet") ||
        file.type.includes("word")
    );

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch(ServerIp + "/pdfupload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Uploaded files:", data);
      setuploadFileData(data); // IMPORTANT
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleReset = () => {
  reset();
  setSubmittedData(null);
  setSelectedFiles([]);
  setuploadFileData(null);
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
        mt: -7,
        py: 1,
        minHeight: "83vh",
        background: "linear-gradient(135deg, #e3eeff 0%, #f8fbff 100%)",
        borderRadius: 1,
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          // boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          // borderBottom: 2
        }}
      >
        Budgetary Quotation
      </Typography>
      {/* <Divider  flexItem sx={{ backgroundColor: '#A9D6E5', height: '4px', mt: 4}}/> */}

      <Divider
        flexItem
        sx={{
          background: "linear-gradient(135deg, #0d47a1 , #42a5f5, #1e88e5)",
          height: "4px",
          mt: 3,
        }}
      />
      {/* ------------------------ TABS ------------------------ */}
      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        centered
        sx={{
          md: 4,
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

      {/* ------------------------ CREATE FORM ------------------------ */}
      {value === 0 && (
        <Container maxWidth="lg">
          <Paper
            elevation={10}
            sx={{
              mt: -2,
              p: { xs: 2, md: 5 },
              borderRadius: 5,
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(14px)",
              // transition: "0.3s",
              boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
              // "&:hover": { transform: "scale(1.01)" },
            }}
          >
            {/* ------------------- FORM START ------------------- */}
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ---------------- SECTION: BQ DETAILS ---------------- */}
              <Card
                sx={{
                  mt: -5,
                  mb: 3,
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
                  mt: -1,
                  mb: 3,
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
                  mt: -1,
                  mb: 3,
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

              <Card
                sx={{
                  mt: -1,
                  mb: 3,
                  p: 3,
                  borderRadius: 4,
                  background: "rgba(250,250,255,0.8)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 800, mb: 2, color: "#0d47a1" }}
                >
                  📎 Attachments
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Button variant="outlined" component="label">
                  Choose Files
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </Button>

                <Button
                  variant="outlined"
                  sx={{ ml: 2 }}
                  onClick={handleFileUpload}
                >
                  Upload Files
                </Button>

                {/* FILE LIST */}
                {selectedFiles.length > 0 && (
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {selectedFiles.map((file, index) => {
                      const fileUrl = URL.createObjectURL(file);

                      return (
                        <Grid item xs={12} md={6} key={index}>
                          <Card
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            }}
                          >
                            <Tooltip title="Click to preview">
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#1e40af",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                  maxWidth: "75%",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                                onClick={() => window.open(fileUrl, "_blank")}
                              >
                                {file.name}
                              </Typography>
                            </Tooltip>

                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
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
                      );
                    })}
                  </Grid>
                )}
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
                    maxWidth: 180,
                    background: "linear-gradient(90deg, #1565c0, #42a5f5)",
                    textTransform: "none",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      background: "linear-gradient(90deg, #0d47a1, #1e88e5)",
                    },
                  }}
                >
                  Submit
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
                    maxWidth: 180,
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
  // ------------
  const [searchTerm, setSearchTerm] = useState("");
  const [defenceFilter, setDefenceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRow, setSelectedRow] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [tempEditingRow, setTempEditingRow] = useState(null);

  // COLUMN SELECTION STATE
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);
  const columnMenuOpen = Boolean(columnMenuAnchor);

  const leadColumns = [
    { id: "bqTitle", label: "BQ Title" },
    { id: "customerName", label: "Customer Name" },
    { id: "customerAddress", label: "Customer Address" },
    { id: "leadOwner", label: "Lead Owner" },
    { id: "defenceAndNonDefence", label: "Defence / Non Defence" },
    { id: "estimateValueInCrWithoutGST", label: "Estimate (CR, w/o GST)" },
    { id: "submittedValueInCrWithoutGST", label: "Submitted (CR, w/o GST)" },
    { id: "dateOfLetterSubmission", label: "Letter Submission Date" },
    { id: "referenceNo", label: "Reference No" },
    { id: "competitors", label: "Competitors" },
    { id: "remarks", label: "Remarks" },
    { id: "presentStatus", label: "Present Status" },
    { id: "dateCreated", label: "Created Date" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    leadColumns.reduce((acc, col) => {
      acc[col.id] = true;
      return acc;
    }, {})
  );

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

  //--------------------SEARCH----------------------
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

  //---------------COLUMN SELECTION HANDLERS-------------------
  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  const handleColumnToggle = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
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
    setSortBy("select");
    setSortDirection("desc");
  };

  // DOWNLOAD ALL DATA AS EXCEL
  // const handleDownloadAllData = () => {
  //   console.log(" data for download : ", data);
  //   if (!data || data.length === 0) {
  //     alert("No data available to download");
  //     return;
  //   }

  //   const worksheet = XLSX.utils.json_to_sheet(data);

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Lead_Submitted");

  //   XLSX.writeFile(
  //     workbook,
  //     `Lead_Submitted_Data_${new Date().toISOString().slice(0, 10)}.xlsx`
  //   );
  // };

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
    setEditingRow((prev) => ({ ...prev }));
  };

  // CANCEL EDIT MODE
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingRow({ ...tempEditingRow });
  };

  // ENTER EDIT MODE
  const handleEnterEditMode = () => {
    setIsEditMode(true);
  };
  // SAVE EDITED VALUES
  const handleEditSave = () => {
    console.log("Saving updated row:", editingRow);

    // TODO: update in backend or props function
    setEditDialogOpen(false);
  };

  // CONFIRM AND SAVE TO BACKEND
  const handleConfirmSave = async () => {
    try {
      console.log("Saving updated row:", editingRow);

      // Mock API call - Replace with real API endpoint
      const mockApiResponse = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Record updated successfully",
            data: editingRow,
          });
        }, 800);
      });

      if (mockApiResponse.success) {
        console.log("Backend Response:", mockApiResponse);
        alert("Changes saved successfully!");
        setConfirmSaveOpen(false);
        setEditDialogOpen(false);
        setIsEditMode(false);
        setEditingRow(null);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  // DELETE ROW
  const handleDeleteClick = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    console.log("Deleting row with ID:", id);

    // TODO: delete logic here
  };

  // DOUBLE CLICK → OPEN READ-ONLY VIEW
  // const handleRowDoubleClick = (row) => {
  //   setViewRow(row);
  //   setViewDialogOpen(true);
  // };

  // ===== TABLE STYLES =====
  const headerCellStyle = {
    fontWeight: 800,
    fontSize: 13,
    color: "#ecfeff",
    background: "linear-gradient(90deg, #001F54, #034078)",
    // "linear-gradient(90deg, #0a47e0ff 0%, #1453b7ff 50%, #81a6daff 100%)",
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
    minWidth: 140,
  };

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
            borderRadius: 1.5,
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
                Budgetary Quotation Data View
              </Typography>
              {/* <Typography
                variant="body2"
                sx={{ opacity: 0.85, mt: 0.5, maxWidth: 520 }}
              >
                View, search, filter and manage all in a single, elegant dashboard.
              </Typography> */}
            </Box>

            {/* SEARCH BOX */}
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by title, customer, reference..."
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
                backgroundColor: "rgba(240,248,255,0.9)", // Light shade
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

            {/* Column Selection Menu */}
            <Tooltip title="Select columns to view in table">
              <IconButton
                onClick={handleColumnMenuOpen}
                sx={{
                  border: "2px solid #1e40af",
                  borderRadius: 1.5,
                  backgroundColor: "rgba(30, 64, 175, 0.06)",
                  color: "#1e40af",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "rgba(30, 64, 175, 0.12)",
                    transform: "scale(1.05)",
                  },
                  maxWidth: 50,
                }}
              >
                <ViewColumnIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={columnMenuAnchor}
              open={columnMenuOpen}
              onClose={handleColumnMenuClose}
              PaperProps={{
                sx: {
                  minWidth: 280,
                  maxHeight: 400,
                },
              }}
            >
              {leadColumns.map((col) => (
                <MenuItem
                  key={col.id}
                  onClick={() => handleColumnToggle(col.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Checkbox
                    checked={visibleColumns[col.id]}
                    // onChange={() => handleColumnToggle(col.id)}
                    size="small"
                  />
                  <span>{col.label}</span>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* FILTERS + SORT */}
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            {/* DEFENCE FILTER */}
            <TextField
              select
              size="small"
              label="Defence / Non Defence"
              value={defenceFilter}
              onChange={handleDefenceFilterChange}
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
              <MenuItem value="Defence">Defence</MenuItem>
              <MenuItem value="Civil">Civil</MenuItem>
            </TextField>

            {/* STATUS FILTER */}
            <TextField
              select
              size="small"
              label="Present Status"
              value={statusFilter}
              onChange={handleStatusFilterChange}
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
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Budgetary Quotation Submitted">
                Budgetary Quotation Submitted
              </MenuItem>
              {/* <MenuItem value="In Progress">In Progress</MenuItem> */}
              <MenuItem value="Commercial Bid Submitted">
                Commercial Bid Submitted
              </MenuItem>
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
              <MenuItem value="select">Select</MenuItem>
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

            {/* SORT ICON BUTTON */}
            <Tooltip
              size="small"
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
                  maxWidth: 50,
                }}
              >
                {sortDirection === "asc" ? <SouthRounded /> : <NorthRounded />}
              </IconButton>
            </Tooltip>

            {/* DOWNLOAD BUTTON */}
            {/* <Button
              variant="contained"
              onClick={() => {
                console.log("click by download");
                handleDownloadAllData();
              }}
              sx={{
                borderRadius: 999,
                background: "linear-gradient(135deg,#16a34a,#22c55e)",
                color: "#fff",
                textTransform: "none",
                px: 3,
                py: 0.9,
                fontWeight: 700,
                boxShadow: "0 6px 16px rgba(22,163,74,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg,#15803d,#16a34a)",
                },
              }}
            >
              Download All Data
            </Button> */}

            {/* RESET BUTTON */}
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              startIcon={<RestartAltRounded />}
              sx={{
                ml: { xs: 0, sm: "auto" },
                borderRadius: 999,
                border: "2px solid #0E4C92", // deep visible blue border
                color: "#0E4C92", // strong readable blue text
                textTransform: "none",
                px: 3,
                py: 0.8,
                fontWeight: 600,
                backgroundColor: "rgba(255,255,255,0.85)", // bright + visible
                backdropFilter: "blur(6px)",
                boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                transition: "0.2s ease",
                "&:hover": {
                  backgroundColor: "#d0eaff", // light sky blue hover
                  borderColor: "#0A3C7D",
                  color: "#0A3C7D",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                },
                // custom
                maxWidth: 130,
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
                <TableCell sx={actionHeaderStyle}>Actions</TableCell>
                {leadColumns.map((col) =>
                  visibleColumns[col.id] ? (
                    <TableCell
                      key={col.id}
                      sx={{
                        ...headerCellStyle,
                        ...(col.id === "customerAddress" && {
                          minWidth: 200,
                        }),
                      }}
                    >
                      {col.label}
                    </TableCell>
                  ) : null
                )}
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
                      // onDoubleClick={() => handleRowDoubleClick(row)}
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
                      {/* ACTIONS COLUMN */}
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
                                maxWidth: 40,
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
                                maxWidth: 40,
                              }}
                            >
                              <DeleteRounded fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>

                      {leadColumns.map((col) => {
                        if (!visibleColumns[col.id]) return null;

                        let cellContent = row[col.id];

                        // Special rendering for specific columns
                        if (col.id === "bqTitle") {
                          return (
                            <TableCell
                              key={col.id}
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
                              {cellContent}
                            </TableCell>
                          );
                        }

                        if (col.id === "customerName") {
                          return (
                            <TableCell
                              key={col.id}
                              sx={{
                                fontSize: 14,
                                maxWidth: 180,
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {cellContent}
                            </TableCell>
                          );
                        }

                        if (col.id === "customerAddress") {
                          return (
                            <TableCell
                              key={col.id}
                              align="left"
                              sx={{
                                fontSize: 13,
                                maxWidth: 260,
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {cellContent}
                            </TableCell>
                          );
                        }

                        if (col.id === "defenceAndNonDefence") {
                          return (
                            <TableCell
                              key={col.id}
                              align="left"
                              sx={{ fontSize: 13 }}
                            >
                              <Chip
                                size="small"
                                label={cellContent || "-"}
                                sx={{
                                  borderRadius: 999,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  backgroundColor:
                                    cellContent === "Defence"
                                      ? "rgba(22,163,74,0.12)"
                                      : "rgba(59,130,246,0.12)",
                                  color:
                                    cellContent === "Defence"
                                      ? "#15803d"
                                      : "#1d4ed8",
                                }}
                              />
                            </TableCell>
                          );
                        }

                        if (col.id === "presentStatus") {
                          return (
                            <TableCell
                              key={col.id}
                              align="left"
                              sx={{ fontSize: 13 }}
                            >
                              <Chip
                                size="small"
                                label={cellContent || "-"}
                                sx={{
                                  borderRadius: 999,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  backgroundColor:
                                    cellContent === "Closed"
                                      ? "rgba(248,113,113,0.18)"
                                      : cellContent === "In Progress"
                                      ? "rgba(234,179,8,0.18)"
                                      : "rgba(52,211,153,0.18)",
                                  color:
                                    cellContent === "Closed"
                                      ? "#b91c1c"
                                      : cellContent === "In Progress"
                                      ? "#92400e"
                                      : "#15803d",
                                }}
                              />
                            </TableCell>
                          );
                        }

                        if (
                          col.id === "referenceNo" ||
                          col.id === "competitors"
                        ) {
                          return (
                            <TableCell
                              key={col.id}
                              align="left"
                              sx={{
                                fontSize: 13,
                                maxWidth: 160,
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {col.id === "competitors"
                                ? row.JSON_competitors
                                : cellContent}
                            </TableCell>
                          );
                        }

                        if (col.id === "remarks") {
                          return (
                            <TableCell
                              key={col.id}
                              align="left"
                              sx={{
                                fontSize: 13,
                                maxWidth: 200,
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                              }}
                            >
                              {cellContent}
                            </TableCell>
                          );
                        }

                        // Default rendering for other columns
                        return (
                          <TableCell
                            key={col.id}
                            align="left"
                            sx={{ fontSize: 13 }}
                          >
                            {cellContent}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              {(!props.ViewData.data || props.ViewData.data.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={
                      leadColumns.filter((c) => visibleColumns[c.id]).length + 1
                    }
                    align="center"
                    sx={{ py: 4 }}
                  >
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

      {/* EDIT DIALOG - VIEW MODE & EDIT MODE - PROFESSIONAL BLUE THEME */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditCancel}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            background: "#ffffff",
            boxShadow:
              "0 25px 50px rgba(0,0,0,0.15), 0 10px 30px rgba(30,64,95,0.2)",
            maxHeight: "80vh",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pr: 2,
            background: isEditMode
              ? "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)" // ORANGE (Edit)
              : "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)", // BLUE (View)
            color: "#ffffff",
            borderBottom: isEditMode
              ? "3px solid #fb923c"
              : "3px solid #60a5fa",
            py: 2.5,
            transition: "all 0.3s ease", // smooth color change
          }}
        >
          {/* title and heading */}
          <Box display="flex" alignItems="center" gap={4}>
            <Box
              sx={{
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              📋
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#ffffff" }}
              >
                {editingRow?.tenderName || "BQ Details"}
              </Typography>
              {/* <Typography variant="caption" sx={{ color: "#bfdbfe", mt: 0.5 }}>
                Reference: {editingRow?.tenderReferenceNo || "N/A"}
              </Typography> */}
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={isEditMode ? "EDIT MODE" : "VIEW MODE"}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                background: isEditMode ? "#fbbf24" : "#60a5fa",
                color: isEditMode ? "#1f2937" : "#ffffff",
                mr: 8,
              }}
            />
            {/* This is for close the dialog box "x" */}
            {/* <IconButton
              onClick={handleEditCancel}
              sx={{
                color: "#ffffff",
                mr: 8,
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
              }}
            >
              <CloseRounded />
            </IconButton> */}
          </Box>
        </DialogTitle>

        {/* defaultValues: {
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
    }, */}

        {/* CONTENT - TABULAR MATRIX FORMAT */}
        <DialogContent
          sx={{
            background: "#f8fafc",
            p: 0,
            maxHeight: "calc(90vh - 130px)",
            overflowY: "auto",
            overflowX: "hidden",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#e2e8f0",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#94a3b8",
              borderRadius: "4px",
            },
            "@media (max-height: 800px)": {
              maxHeight: "calc(85vh - 130px)",
            },
          }}
        >
          <Box sx={{ p: 1.5 }}>
            {/* TENDER INFORMATION SECTION */}
            <Box sx={{ mb: 3 }}>
              {/* <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: "#1e3a5f",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Box sx={{ width: 4, height: 20, background: "#1e40af", borderRadius: 1 }} />
                Tender Information
              </Typography> */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    // sm: "repeat(2, 1fr)",
                    // md: "repeat(2, 1fr)",
                    // lg: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  { label: "Bq Title", key: "bqTitle" },
                  // { label: "Tender Reference No", key: "tenderReferenceNo" },
                  // { label: "Document Type", key: "documentType" },
                  // { label: "Tender Dated", key: "tenderDated", isDate: true },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant=""
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",

                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        multiline
                        size="small"
                        type={field.isDate ? "date" : "text"}
                        InputLabelProps={
                          field.isDate ? { shrink: true } : undefined
                        }
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* CUSTOMER INFORMATION SECTION */}
            <Box sx={{ mb: 3 }}>
              {/* <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: "#1e3a5f",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Box sx={{ width: 4, height: 20, background: "#1e40af", borderRadius: 1 }} />
                Customer Information
              </Typography> */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  { label: "Customer Name", key: "customerName" },
                  { label: "Customer Address", key: "customerAddress" },
                  { label: "Lead Owner", key: "leadOwner" },
                  { label: "Civil / Defence", key: "defenceAndNonDefence" },
                  // { label: "Business Domain", key: "businessDomain" },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Customer Address - Full Width */}
              {/* <Box
                sx={{
                  background: "#ffffff",
                  border: "1px solid #e0e7ff",
                  borderRadius: 2,
                  p: 2,
                  mt: 2,
                  "&:hover": {
                    borderColor: "#60a5fa",
                    boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: "0.7rem",
                  }}
                >
                  Customer Address
                </Typography>
                {isEditMode ? (
                  <TextField
                    value={editingRow?.customerAddress || ""}
                    onChange={(e) =>
                      handleEditFieldChange("customerAddress", e.target.value)
                    }
                    fullWidth
                    size="small"
                    multiline
                    minRows={2}
                    sx={{
                      mt: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                        background: "#ffffff",
                        "& fieldset": {
                          borderColor: "#60a5fa",
                        },
                        "&:hover fieldset": {
                          borderColor: "#1e40af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1e40af",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        color: "#1e293b",
                        fontWeight: 600,
                      },
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      mt: 1,
                      color: "#1e293b",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {editingRow?.customerAddress || "-"}
                  </Typography>
                )}
              </Box> */}
            </Box>

            {/* FINANCIAL DETAILS SECTION */}
            <Box sx={{ mb: 3 }}>
              {/* <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: "#1e3a5f",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Box sx={{ width: 4, height: 20, background: "#1e40af", borderRadius: 1 }} />
                Financial Details
              </Typography> */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  // { label: "Value of EMD", key: "valueOfEMD" },
                  {
                    label: "Estimated Value (Cr, w/o GST)",
                    key: "estimateValueInCrWithoutGST",
                  },
                  {
                    label: "Submitted Value (Cr, w/o GST)",
                    key: "submittedValueInCrWithoutGST",
                  },
                  // {
                  //   label: "Order Won Value (Cr, w/o GST)",
                  //   key: "orderWonValueInCrWithoutGST",
                  // },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* TIMELINE SECTION */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  {
                    label: "Date of Letter Submission",
                    key: "dateOfLetterSubmission",
                    isDate: true,
                  },
                  { label: "Reference No", key: "referenceNo" },
                  // {
                  //   label: "Pre-Bid Meeting Date & Time",
                  //   key: "prebidMeetingDateTime",
                  // },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        type={field.isDate ? "datetime-local" : "text"}
                        InputLabelProps={
                          field.isDate ? { shrink: true } : undefined
                        }
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* STATUS & RESULTS SECTION */}
            <Box sx={{ mb: 3 }}>
              {/* <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: "#1e3a5f",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Box sx={{ width: 4, height: 20, background: "#1e40af", borderRadius: 1 }} />
                Status & Results
              </Typography> */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  // {
                  //   label: "Won / Lost / Participated",
                  //   key: "wonLostParticipated",
                  // },
                  // { label: "Open / Closed", key: "openClosed" },
                  // { label: "Present Status", key: "presentStatus" },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* ADDITIONAL INFORMATION SECTION */}
            <Box sx={{ mb: 2 }}>
              {/* <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: "#1e3a5f",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "0.95rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Box sx={{ width: 4, height: 20, background: "#1e40af", borderRadius: 1 }} />
                Additional Information
              </Typography> */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {[
                  { label: "Competitors Info", key: "JSON_competitors" },
                  {
                    label: "Present Status",
                    key: "presentStatus",
                  },
                  // {
                  //   label: "Corrigendums Date / File",
                  //   key: "corrigendumsDateFile",
                  // },
                ].map((field) => (
                  <Box
                    key={field.key}
                    sx={{
                      background: "#ffffff",
                      border: "1px solid #e0e7ff",
                      borderRadius: 2,
                      p: 2,
                      "&:hover": {
                        borderColor: "#60a5fa",
                        boxShadow: "0 4px 12px rgba(96,165,250,0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        fontSize: "0.7rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    {isEditMode ? (
                      <TextField
                        value={editingRow?.[field.key] || ""}
                        onChange={(e) =>
                          handleEditFieldChange(field.key, e.target.value)
                        }
                        fullWidth
                        size="small"
                        multiline
                        minRows={2}
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            background: "#ffffff",
                            "& fieldset": {
                              borderColor: "#60a5fa",
                            },
                            "&:hover fieldset": {
                              borderColor: "#1e40af",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#1e40af",
                              borderWidth: 2,
                            },
                          },
                          "& .MuiOutlinedInput-input": {
                            color: "#1e293b",
                            fontWeight: 600,
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          mt: 1,
                          color: "#1e293b",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {editingRow?.[field.key] || "-"}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        {/* DIALOG ACTIONS */}
        <DialogActions
          sx={{
            background: "#f8fafc",
            borderTop: "1px solid #e0e7ff",
            p: 2.5,
            gap: 1.5,
          }}
        >
          {!isEditMode ? (
            <>
              <Button
                onClick={handleEditCancel}
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  maxWidth: 180,
                  letterSpacing: "0.5px",
                  backgroundColor: "#e2e8ff",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                  },
                }}
              >
                Close
              </Button>
              <Button
                onClick={handleEnterEditMode}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #1e40af 0%, #1e3a5f 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
                  maxWidth: 180,
                  px: 3,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #1e3a5f 0%, #162e4a 100%)",
                    boxShadow: "0 8px 24px rgba(30,64,95,0.3)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                ✏️ Edit Details
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleCancelEdit}
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  maxWidth: 180,
                  letterSpacing: "0.5px",
                  "&:hover": {
                    backgroundColor: "#e2e8f0",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                  letterSpacing: "0.5px",
                  maxWidth: 220,
                  px: 3,
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                💾 Save Changes
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* CONFIRMATION DIALOG */}
      <Dialog
        open={confirmSaveOpen}
        onClose={() => setConfirmSaveOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "#ffffff",
            boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            color: "#1e3a5f",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "2px solid #fbbf24",
          }}
        >
          <Box sx={{ fontSize: 28 }}>⚠️</Box>
          <Box>
            <Typography sx={{ fontWeight: 800, color: "#1e3a5f" }}>
              Confirm Update
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Please review before saving
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography sx={{ color: "#475569", lineHeight: 1.6 }}>
            You are about to update this tender record with the following
            changes. This action will be synced to the database immediately.
          </Typography>
          <Box
            sx={{
              mt: 2.5,
              p: 2,
              background: "#f0f9ff",
              border: "1px solid #bfdbfe",
              borderRadius: 2,
              color: "#1e3a5f",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            📌 Make sure all fields are correct before confirming.
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            background: "#f8fafc",
            borderTop: "1px solid #e0e7ff",
            p: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={() => setConfirmSaveOpen(false)}
            sx={{
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              "&:hover": { backgroundColor: "#e2e8f0" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSave}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "#ffffff",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.85rem",
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                boxShadow: "0 8px 24px rgba(239,68,68,0.3)",
              },
            }}
          >
            ✓ Yes, Save Changes
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

  // ✅ FIXED SAMPLE FILE DOWNLOAD (Bulk Upload)
  const handleDownloadSampleExcel = () => {
    const fileUrl = "/sample/Budgetary_Quotation_Sample.xlsx"; // fixed public path
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "Budgetary_Quotation_Sample.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        mb: 5,
        minHeight: "70vh",
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
          mb: 8,
          width: "100%",
          maxWidth: 720,
          p: 4,
          borderRadius: 4,
          position: "relative", // ✅ REQUIRED FOR TOP-RIGHT BUTTON
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 45px rgba(0,0,0,0.12)",
        }}
      >
        {/* DOWNLOAD SAMPLE BUTTON */}

        {/* <Box sx={{ position: "absolute", top: 16, right: 16 }}>
  <Button
    // startIcon={<CloudQueueRoundedIcon />}
    onClick={handleDownloadSampleExcel}
    sx={{
      borderRadius: 999,
      px: 3,
      py: 0.9,
      fontWeight: 700,
      fontSize: 13,
      textTransform: "none",

      color: "#2563eb",
      backgroundColor: "#eff6ff",
      border: "1px solid #bfdbfe",

      boxShadow: "0 4px 12px rgba(37,99,235,0.15)",
      transition: "all 0.2s ease",

      "&:hover": {
        backgroundColor: "#dbeafe",
        borderColor: "#60a5fa",
        transform: "translateY(-1px)",
      },
    }}
  >
    Download Sample Excel
  </Button>
</Box> */}

        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <Button
            onClick={handleDownloadSampleExcel}
            sx={{
              borderRadius: 999,
              px: 3.4,
              py: 1,
              fontWeight: 700,
              fontSize: 13.5,
              textTransform: "none",

              /* Soft pastel gradient */
              background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
              color: "#1e40af",
              border: "1.5px solid #bae6fd",

              boxShadow:
                "0 6px 14px rgba(59,130,246,0.18), inset 0 0 0 1px rgba(255,255,255,0.6)",

              transition: "all 0.25s ease",

              "&:hover": {
                background: "linear-gradient(135deg, #e0f2fe, #dbeafe)",
                transform: "translateY(-2px) scale(1.04)",
                boxShadow:
                  "0 10px 24px rgba(59,130,246,0.28), inset 0 0 0 1px rgba(255,255,255,0.7)",
              },

              "&:active": {
                transform: "scale(0.96)",
                boxShadow: "0 4px 10px rgba(59,130,246,0.22)",
              },
            }}
          >
            Download Sample Excel
          </Button>
        </Box>

        {/* TITLE */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            textAlign: "center",
            color: "#0d47a1",
            mb: 1,
            mt: 6, // ✅ prevents overlap with button
          }}
        >
          Upload Export Leads Data
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
              mb: 5,
              border: "2px dashed #93c5fd",
              borderRadius: 4,
              p: { xs: 4, sm: 6 },
              minHeight: 280,
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
                mb: 4,
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

        {/* PUSH BUTTON */}
        {excelData.length > 0 && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
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
