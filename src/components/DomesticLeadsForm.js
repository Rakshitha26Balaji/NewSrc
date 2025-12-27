import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Divider,
  Snackbar,
  Alert,
  Card,
  Tabs,
  Tab,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from "@mui/material";

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

import axios from "axios";

const tenderTypeOptions = ["ST", "MT"];
const civilDefenceOptions = ["Civil", "Defence"];
const businessDomainOptions = [
  "IT",
  "Electronics",
  "Telecom",
  "Construction",
  "Other",
];
const documentTypeOptions = [
  "RFP",
  "RFI",
  "RFE",
  "EoI",
  "BQ",
  "ST",
  "NIT",
  "RFQ",
];

const resultStatusOptions = [
  "Won",
  "Lost",
  "Participated",
  "Participated-Won",
  "Participated-Pursuing",
  "Participated-Lost",
  "Not Participated",
];

const openClosedOptions = ["Open", "Closed"];

const presentStatusOptions = [
  "BQ Submitted",
  "Commercial Bid Submitted",
  "EOI was submitted",
  "Not participated",
  " ",
];

const multilineProps = { multiline: true, rows: 2 };

const today = new Date().toLocaleDateString("en-CA");
const now = new Date().toLocaleString("sv-SE").slice(0, 16);


const DomesticLeadForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const API = "/getDomesticLead";
  let user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    axios
      .get(`/config.json`)
      .then((response) => {
        const apiUrl = response.data.project[0].ServerIP[0].NodeServerIP + API;
        SetServerIp(apiUrl);
        return axios.get(apiUrl);
      })
      .then((response) => {
        console.log("GOT DATA FROM DOMESTIC LEAD", response);
        setOrderData(response.data);
      })
      .catch((error) => {
        console.log(error.message);
        // fallback (if needed you can append API)
        SetServerIp("172.195.120.135" + API);
      });
  }, []);

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
      leadOwner: "",
      civilOrDefence: "",
      businessDomain: "",
      valueOfEMD: "",
      estimatedValueInCrWithoutGST: "",
      submittedValueInCrWithoutGST: "",
      tenderDated: "",
      lastDateOfSub: "",
      soleOrConsortium: "",
      prebidMeetingDateTime: "",
      competitorsInfo: "",
      wonLostParticipated: "",
      openClosed: "",
      orderWonValueInCrWithoutGST: "",
      presentStatus: "",
      reasonForLossingOpp: "",
      corrigendumsDateFile: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Raw Form Data:", data);

    const formattedData = {
      tenderName: data.tenderName,
      tenderReferenceNo: data.tenderReferenceNo,
      customerName: data.customerName,
      customerAddress: data.customerAddress,
      tenderType: data.tenderType,
      documentType: data.documentType,
      leadOwner: data.leadOwner,
      civilOrDefence: data.civilOrDefence,
      businessDomain: data.businessDomain,
      valueOfEMD: data.valueOfEMD,
      estimatedValueInCrWithoutGST:
        data.estimatedValueInCrWithoutGST !== ""
          ? parseFloat(parseFloat(data.estimatedValueInCrWithoutGST).toFixed(5))
          : null,
      submittedValueInCrWithoutGST:
        data.submittedValueInCrWithoutGST !== ""
          ? parseFloat(parseFloat(data.submittedValueInCrWithoutGST).toFixed(5))
          : null,
      tenderDated: data.tenderDated,
      lastDateOfSub: data.lastDateOfSub,
      soleOrConsortium: data.soleOrConsortium,
      prebidMeetingDateTime: data.prebidMeetingDateTime,
      competitorsInfo: data.competitorsInfo,
      wonLostParticipated: data.wonLostParticipated,
      openClosed: data.openClosed,
      orderWonValueInCrWithoutGST: data.orderWonValueInCrWithoutGST,
      presentStatus: data.presentStatus,
      reasonForLossingOpp: data.reasonForLossingOpp,
      corrigendumsDateFile: data.corrigendumsDateFile,
      submittedAt: new Date().toISOString(),
      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
    };

    console.log(
      "Frontend Domestic Lead Data:",
      JSON.stringify(formattedData, null, 2)
    );

    axios
      .post(ServerIp, formattedData)
      .then((response) => {
        console.log("Server Response:", response.data);
        setSubmittedData(formattedData);
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
      link.download = `domestic-leads-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

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
            background: "rgba(255,255,255,0.9)",
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
                background: "linear-gradient(45deg, #0d47a1, #42a5f5, #1e88e5)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Domestic Leads Form
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ opacity: 0.7, mt: 1, fontWeight: 500 }}
            >
              Capture domestic lead details, financials, and outcomes in one
              streamlined workflow.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* SECTION 1: BASIC DETAILS */}
            <Card
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.85)",
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
                📌 Tender & Customer Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Tender Name */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="tenderName"
                    control={control}
                    rules={{ required: "Tender Name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tender Name"
                        error={!!errors.tenderName}
                        helperText={errors.tenderName?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            "&:hover": { boxShadow: "0 0 10px #bbdefb" },
                            "&.Mui-focused": { boxShadow: "0 0 15px #90caf9" },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Tender Reference No */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="tenderReferenceNo"
                    control={control}
                    rules={{ required: "Tender Reference No is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tender Reference No"
                        error={!!errors.tenderReferenceNo}
                        helperText={errors.tenderReferenceNo?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Customer Name */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="customerName"
                    control={control}
                    rules={{ required: "Customer Name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Customer Name"
                        error={!!errors.customerName}
                        helperText={errors.customerName?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Customer Address */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="customerAddress"
                    control={control}
                    rules={{ required: "Customer Address is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Customer Address"
                        {...multilineProps}
                        error={!!errors.customerAddress}
                        helperText={errors.customerAddress?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Tender Type */}
                <Grid item xs={12} md={3}>
                  <Controller
                    name="tenderType"
                    control={control}
                    rules={{ required: "Tender Type is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Tender Type"
                        error={!!errors.tenderType}
                        helperText={errors.tenderType?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      >
                        {tenderTypeOptions.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Document Type */}
                <Grid item xs={12} md={3}>
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
                        error={!!errors.documentType}
                        helperText={errors.documentType?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
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

            {/* SECTION 2: CLASSIFICATION & DOMAIN */}
            <Card
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.85)",
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
                🏷️ Classification & Owner
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Lead Owner */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="leadOwner"
                    control={control}
                    rules={{ required: "Lead Owner is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Lead Owner"
                        error={!!errors.leadOwner}
                        helperText={errors.leadOwner?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Civil / Defence */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="civilOrDefence"
                    control={control}
                    rules={{
                      required: "Civil / Defence selection is required",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Civil / Defence"
                        error={!!errors.civilOrDefence}
                        helperText={errors.civilOrDefence?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      >
                        {civilDefenceOptions.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Business Domain */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="businessDomain"
                    control={control}
                    rules={{ required: "Business Domain is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Business Domain"
                        error={!!errors.businessDomain}
                        helperText={errors.businessDomain?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      >
                        {businessDomainOptions.map((item) => (
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

            {/* SECTION 3: VALUES */}
            <Card
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.85)",
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
                💰 Financial Values
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* EMD Value */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="valueOfEMD"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Value of EMD"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
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

                {/* Estimate Value */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="estimatedValueInCrWithoutGST"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Estimate Value in Cr (w/o GST)"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
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

                {/* Submitted Value */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="submittedValueInCrWithoutGST"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Submitted Value in Cr (w/o GST)"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
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

            {/* SECTION 4: TIMELINE */}
            <Card
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.85)",
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
                🗓️ Submission Timeline
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {[
                  ["tenderDated", "Tender Dated"],
                  ["lastDateOfSub", "Last Date of Submission"],
                ].map(([name, label]) => (
                  <Grid item xs={12} md={4} key={name}>
                    <Controller
                      name={name}
                      control={control}
                      rules={{ required: `${label} is required` }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          label={label}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors[name]}
                          helperText={errors[name]?.message}
                          inputProps={{
                            max: today, // ✅ past + today enabled, future disabled
                          }}
                        />
                      )}
                    />
                  </Grid>
                ))}

                {/* Sole / Consortium */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="soleOrConsortium"
                    control={control}
                    rules={{ required: "Sole / Consortium is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Sole / Consortium"
                        className="text-field-style"
                        {...multilineProps}
                        error={!!errors.soleConsortium}
                        helperText={errors.soleConsortium?.message}
                      />
                    )}
                  />
                </Grid>

                {/* Pre-bid Date */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="prebidMeetingDateTime"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="datetime-local"
                        fullWidth
                        label="Pre-Bid Meeting Date & Time"
                        InputLabelProps={{ shrink: true }}
                        className="text-field-style"
                        inputProps={{
                          max: now, // ✅ disables future date & time
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* SECTION 5: COMPETITORS & RESULTS */}
            <Card
              sx={{
                mb: 4,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.85)",
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
                📊 Competitors & Results
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Competitors Info */}
                <Grid item xs={12}>
                  <Controller
                    name="competitorsInfo"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Competitors Info"
                        {...multilineProps}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Result Status */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="wonLostParticipated"
                    control={control}
                    rules={{ required: "Result Status is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Won / Lost / Participated / Not Participated"
                        error={!!errors.wonLostParticipated}
                        helperText={errors.wonLostParticipated?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      >
                        {resultStatusOptions.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Open / Closed */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="openClosed"
                    control={control}
                    rules={{ required: "Open / Closed is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Open / Closed"
                        error={!!errors.openClosed}
                        helperText={errors.openClosed?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      >
                        {openClosedOptions.map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                {/* Order Won Value */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="orderWonValueInCrWithoutGST"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Order Won Value in Cr (w/o GST)"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₹</InputAdornment>
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

                {/* Present Status */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="presentStatus"
                    control={control}
                    rules={{ required: "Present Status is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Present Status"
                        error={!!errors.presentStatus}
                        helperText={errors.presentStatus?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      >
                        {presentStatusOptions.map((item) => (
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

            {/* SECTION 6: REASON & INFO */}
            <Card
              sx={{
                mb: 2,
                p: 3,
                borderRadius: 4,
                background: "rgba(250,250,255,0.85)",
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
                📋 Reason & Corrigendum Info
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Reason */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="reasonForLossingOpp"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Reason for Losing / Participated / Not Participating"
                        {...multilineProps}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Corrigendum Info */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="corrigendumsDateFile"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Corrigendum Info"
                        {...multilineProps}
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

            {/* BUTTONS */}
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
                🚀 Submit Domestic Lead
              </Button>

              <Button
                type="button"
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

          {/* Snackbar */}
          <Snackbar
            open={submitSuccess}
            autoHideDuration={4500}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity="success" onClose={handleCloseSnackbar}>
              🎉 Domestic lead submitted successfully!
            </Alert>
          </Snackbar>

          {/* JSON OUTPUT */}
          {submittedData && (
            <Box sx={{ mt: 6 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  📌 Submitted Data (JSON)
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handleDownloadJSON}
                >
                  Download JSON
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  backgroundColor: "#0d1117",
                  color: "#c9d1d9",
                  maxHeight: 500,
                  overflow: "auto",
                  borderRadius: 3,
                  fontFamily: "monospace",
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <pre>{JSON.stringify(submittedData, null, 2)}</pre>
              </Paper>
            </Box>
          )}
        </Paper>
      )}

      {/* ------------------------ VIEW DATA ------------------------ */}
      {value === 1 && orderData && (
        <ViewDomesticLeadsData ViewData={orderData} />
      )}
    </Container>
  );
};

// ------------------------------------------------------------------------
// VIEW COMPONENT WITH SEARCH + FILTERS + SORT + EDIT / DELETE
// ------------------------------------------------------------------------

function ViewDomesticLeadsData(props) {
  console.log("props viewDomesticData", props.ViewData);

  const data = props.ViewData?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [tenderTypeFilter, setTenderTypeFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");
  const [openClosedFilter, setOpenClosedFilter] = useState("all");

  const [sortBy, setSortBy] = useState("dateCreated");
  const [sortDirection, setSortDirection] = useState("desc");

  const [selectedRow, setSelectedRow] = useState(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  // Handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleTenderTypeFilterChange = (e) =>
    setTenderTypeFilter(e.target.value);

  const handleResultFilterChange = (e) => setResultFilter(e.target.value);

  const handleOpenClosedFilterChange = (e) =>
    setOpenClosedFilter(e.target.value);

  const handleSortByChange = (e) => setSortBy(e.target.value);

  const toggleSortDirection = () =>
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleResetFilters = () => {
    setSearchTerm("");
    setTenderTypeFilter("all");
    setResultFilter("all");
    setOpenClosedFilter("all");
    setSortBy("dateCreated");
    setSortDirection("desc");
  };

  const handleRowSelect = (row) => {
    setSelectedRow(row);
  };

  const handleEditClick = (row) => {
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
    console.log("Saving updated Domestic Lead:", editingRow);
    // TODO: connect to backend update API
    setEditDialogOpen(false);
  };

  const handleDeleteClick = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    console.log("Deleting Domestic Lead with ID:", id);
    // TODO: connect to backend delete API
  };

  // Filter + sort logic
  const filteredSortedData =
    data &&
    data
      .filter((row) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          row.tenderName?.toLowerCase().includes(q) ||
          row.customerName?.toLowerCase().includes(q) ||
          row.tenderReferenceNo?.toLowerCase().includes(q) ||
          row.leadOwner?.toLowerCase().includes(q) ||
          row.customerAddress?.toLowerCase().includes(q);

        const matchesTenderType =
          tenderTypeFilter === "all" ||
          row.tenderType?.toLowerCase() === tenderTypeFilter.toLowerCase();

        const matchesResult =
          resultFilter === "all" ||
          row.wonLostParticipated?.toLowerCase() === resultFilter.toLowerCase();

        const matchesOpenClosed =
          openClosedFilter === "all" ||
          row.openClosed?.toLowerCase() === openClosedFilter.toLowerCase();

        return (
          matchesSearch &&
          matchesTenderType &&
          matchesResult &&
          matchesOpenClosed
        );
      })
      .sort((a, b) => {
        let aVal;
        let bVal;

        switch (sortBy) {
          case "tenderDated":
            aVal = a.tenderDated || "";
            bVal = b.tenderDated || "";
            break;
          case "lastDateOfSub":
            aVal = a.lastDateOfSub || "";
            bVal = b.lastDateOfSub || "";
            break;
          case "estimatedValueInCrWithoutGST":
            aVal = parseFloat(a.estimatedValueInCrWithoutGST) || 0;
            bVal = parseFloat(b.estimatedValueInCrWithoutGST) || 0;
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
      });

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
                Domestic Leads List
              </Typography>
              <Typography
                variant="body2"
                sx={{ opacity: 0.85, mt: 0.5, maxWidth: 520 }}
              >
                View, search, filter and manage all domestic leads in a single,
                elegant dashboard.
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
            {/* Tender Type Filter */}
            <TextField
              select
              size="small"
              label="Tender Type"
              value={tenderTypeFilter}
              onChange={handleTenderTypeFilterChange}
              sx={{
                minWidth: 150,
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
              {tenderTypeOptions.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            {/* Result Filter */}
            <TextField
              select
              size="small"
              label="Result Status"
              value={resultFilter}
              onChange={handleResultFilterChange}
              sx={{
                minWidth: 210,
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
              {resultStatusOptions.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>

            {/* Open/Closed Filter */}
            <TextField
              select
              size="small"
              label="Open / Closed"
              value={openClosedFilter}
              onChange={handleOpenClosedFilterChange}
              sx={{
                minWidth: 160,
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
              {openClosedOptions.map((oc) => (
                <MenuItem key={oc} value={oc}>
                  {oc}
                </MenuItem>
              ))}
            </TextField>

            {/* Sort By */}
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
              <MenuItem value="tenderDated">Tender Dated</MenuItem>
              <MenuItem value="lastDateOfSub">Last Date of Submission</MenuItem>
              <MenuItem value="estimatedValueInCrWithoutGST">
                Estimate Value
              </MenuItem>
              <MenuItem value="submittedValueInCrWithoutGST">
                Submitted Value
              </MenuItem>
            </TextField>

            {/* Sort Direction */}
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

            {/* Reset Button */}
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
          <Table stickyHeader aria-label="domestic leads table" size="small">
            <TableHead>
              <TableRow>
                {[
                  "Tender Name",
                  "Tender Ref No",
                  "Customer Name",
                  "Customer Address",
                  "Tender Type",
                  "Document Type",
                  "Lead Owner",
                  "Civil / Defence",
                  "Business Domain",
                  "Value of EMD",
                  "Estimate (Cr, w/o GST)",
                  "Submitted (Cr, w/o GST)",
                  "Tender Dated",
                  "Last Date of Submission",
                  "Sole / Consortium",
                  "Pre-bid Date & Time",
                  "Competitors Info",
                  "Result Status",
                  "Open / Closed",
                  "Order Won (Cr, w/o GST)",
                  "Present Status",
                  "Reason / Decision Note",
                  "Corrigendum Info",
                  "Created Date",
                  "Actions",
                ].map((header, idx) => (
                  <TableCell
                    key={header}
                    align={
                      header === "Actions"
                        ? "center"
                        : idx === 0
                        ? "left"
                        : "left"
                    }
                    sx={{
                      fontWeight: 800,
                      fontSize: 13,
                      color: "#f9fafb",
                      background:
                        "linear-gradient(90deg,#0ea5e9 0%,#2563eb 50%,#4f46e5 100%)",
                      borderBottom: "none",
                      whiteSpace: "nowrap",
                      ...(header === "Customer Address" && { minWidth: 200 }),
                      ...(header === "Competitors Info" && { minWidth: 220 }),
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredSortedData && filteredSortedData.length > 0 ? (
                filteredSortedData.map((row) => (
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
                        fontSize: 13,
                        maxWidth: 160,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {row.tenderReferenceNo}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        maxWidth: 160,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {row.customerName}
                    </TableCell>
                    <TableCell
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
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.tenderType}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.documentType}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{row.leadOwner}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      <Chip
                        size="small"
                        label={row.civilOrDefence || "-"}
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 600,
                          backgroundColor:
                            row.civilOrDefence === "Defence"
                              ? "rgba(22,163,74,0.12)"
                              : "rgba(59,130,246,0.12)",
                          color:
                            row.civilOrDefence === "Defence"
                              ? "#15803d"
                              : "#1d4ed8",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.businessDomain}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.valueOfEMD}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.estimatedValueInCrWithoutGST}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.submittedValueInCrWithoutGST}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.tenderDated}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.lastDateOfSub}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.soleOrConsortium}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.prebidMeetingDateTime}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        maxWidth: 220,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {row.competitorsInfo}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      <Chip
                        size="small"
                        label={row.wonLostParticipated || "-"}
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor:
                            row.wonLostParticipated === "Lost"
                              ? "rgba(248,113,113,0.18)"
                              : row.wonLostParticipated?.includes("Won")
                              ? "rgba(52,211,153,0.18)"
                              : row.wonLostParticipated?.includes("Not")
                              ? "rgba(148,163,184,0.25)"
                              : "rgba(234,179,8,0.18)",
                          color:
                            row.wonLostParticipated === "Lost"
                              ? "#b91c1c"
                              : row.wonLostParticipated?.includes("Won")
                              ? "#15803d"
                              : row.wonLostParticipated?.includes("Not")
                              ? "#111827"
                              : "#92400e",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.openClosed}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {row.orderWonValueInCrWithoutGST}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      <Chip
                        size="small"
                        label={row.presentStatus || "-"}
                        sx={{
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          backgroundColor: "rgba(59,130,246,0.1)",
                          color: "#1d4ed8",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        maxWidth: 260,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {row.reasonForLossingOpp}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: 13,
                        maxWidth: 220,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {row.corrigendumsDateFile}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={25} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" sx={{ color: "#6b7280" }}>
                      No domestic leads found.
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
          Edit Domestic Lead
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

            <Grid item xs={12}>
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
                select
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
              >
                {tenderTypeOptions.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
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
              >
                {documentTypeOptions.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Lead Owner"
                value={editingRow?.leadOwner || ""}
                onChange={(e) =>
                  handleEditFieldChange("leadOwner", e.target.value)
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
                select
                label="Civil / Defence"
                value={editingRow?.civilOrDefence || ""}
                onChange={(e) =>
                  handleEditFieldChange("civilOrDefence", e.target.value)
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
              >
                {civilDefenceOptions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Business Domain"
                value={editingRow?.businessDomain || ""}
                onChange={(e) =>
                  handleEditFieldChange("businessDomain", e.target.value)
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
              >
                {businessDomainOptions.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Value of EMD"
                value={editingRow?.valueOfEMD || ""}
                onChange={(e) =>
                  handleEditFieldChange("valueOfEMD", e.target.value)
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
                label="Estimate Value in Cr (w/o GST)"
                value={editingRow?.estimatedValueInCrWithoutGST || ""}
                onChange={(e) =>
                  handleEditFieldChange(
                    "estimatedValueInCrWithoutGST",
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
                label="Submitted Value in Cr (w/o GST)"
                value={editingRow?.submittedValueInCrWithoutGST || ""}
                onChange={(e) =>
                  handleEditFieldChange(
                    "submittedValueInCrWithoutGST",
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
                type="date"
                label="Tender Dated"
                value={editingRow?.tenderDated || ""}
                onChange={(e) =>
                  handleEditFieldChange("tenderDated", e.target.value)
                }
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
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
                type="date"
                label="Last Date of Submission"
                value={editingRow?.lastDateOfSub || ""}
                onChange={(e) =>
                  handleEditFieldChange("lastDateOfSub", e.target.value)
                }
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
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
                label="Sole / Consortium"
                value={editingRow?.soleOrConsortium || ""}
                onChange={(e) =>
                  handleEditFieldChange("soleOrConsortium", e.target.value)
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
                label="Competitors Info"
                value={editingRow?.competitorsInfo || ""}
                onChange={(e) =>
                  handleEditFieldChange("competitorsInfo", e.target.value)
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
                select
                label="Result Status"
                value={editingRow?.wonLostParticipated || ""}
                onChange={(e) =>
                  handleEditFieldChange("wonLostParticipated", e.target.value)
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
              >
                {resultStatusOptions.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Open / Closed"
                value={editingRow?.openClosed || ""}
                onChange={(e) =>
                  handleEditFieldChange("openClosed", e.target.value)
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
              >
                {openClosedOptions.map((oc) => (
                  <MenuItem key={oc} value={oc}>
                    {oc}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Reason / Decision Note"
                value={editingRow?.reasonForLossingOpp || ""}
                onChange={(e) =>
                  handleEditFieldChange("reasonForLossingOpp", e.target.value)
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

            <Grid item xs={12}>
              <TextField
                label="Corrigendum Info"
                value={editingRow?.corrigendumsDateFile || ""}
                onChange={(e) =>
                  handleEditFieldChange("corrigendumsDateFile", e.target.value)
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
                select
                label="Present Status"
                value={editingRow?.presentStatus || ""}
                onChange={(e) =>
                  handleEditFieldChange("presentStatus", e.target.value)
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
              >
                {presentStatusOptions.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </TextField>
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

export default DomesticLeadForm;
