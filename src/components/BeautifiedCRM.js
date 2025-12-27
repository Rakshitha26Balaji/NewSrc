import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Snackbar,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

// Old reference options (kept as comment)
// const tenderTypeOptions = ["ST","MT"];
// const document TypeOptions ["PDF", "DOC", "XLS", "Others"];

const tenderTypeOptions = ["ST", "MT"];
const documentTypeOptions = ["PDF", "DOC", "XLS", "Others"];

const CRMLeadForm = (props) => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);

  // Old style (kept as comment)
  // const props = { 
  //   ServerIp: "http://localhost:8882",
  //   Location: "hardwritten",
  // };
  // const API = "/getCRHLeads";
  // const SaveDataURL = props.ServerIp + API;

  const defaultServerIp = "http://localhost:8882";
  const serverIp = props?.ServerIp || defaultServerIp;

  const SaveDataURL = `${serverIp}/CreateCRMLead`;
  const GetDataURL = `${serverIp}/GetDomesticLead`; // or /GetCRMLead based on backend

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      leadID: "",
      issueDate: "",
      tenderName: "",
      organisation: "",
      documentType: "",
      tenderType: "",
      emdInCrore: "",
      approxTenderValueCrore: "",
      lastDateSubmission: "",
      preBidDate: "",
      teamAssigned: "",
      remarks: "",
      corrigendumInfo: "",
      // OperatorId:
      // OperatorName:
      // OperatorRole:
      // OperatorSBU:
    },
  });

  // Common styles
  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
    },
    "& .MuiInputLabel-root": {
      fontSize: 14,
    },
    "& .MuiOutlinedInput-input": {
      fontSize: 14,
    },
  };

  const sectionTitleSx = {
    fontWeight: 700,
    letterSpacing: 0.5,
    mb: 1,
  };

  const cardSx = {
    borderRadius: 3,
    boxShadow: 4,
    mt: 1,
    p: { xs: 2, sm: 3 },
    background: "rgba(255,255,255,0.96)",
  };

  // ✅ WORKING onSubmit
  const onSubmit = (data) => {
    console.log("Raw Form Data:", data);

    // Convert string numbers to actual numbers with 2 decimal precision
    const formattedData = {
      leadID: data.leadID,
      issueDate: data.issueDate,
      tenderName: data.tenderName,
      organisation: data.organisation,
      documentType: data.documentType,
      tenderType: data.tenderType,
      emdInCrore:
        data.emdInCrore !== ""
          ? parseFloat(parseFloat(data.emdInCrore).toFixed(5))
          : null,
      approxTenderValueCrore:
        data.approxTenderValueCrore !== ""
          ? parseFloat(
              parseFloat(data.approxTenderValueCrore).toFixed(5)
            )
          : null,
      // emdInCrore:data.emdInCrore,
      // approxTenderValueCrore:data.approxTenderValueCrore,
      lastDateSubmission: data.lastDateSubmission,
      preBidDate: data.preBidDate,
      teamAssigned: data.teamAssigned,
      remarks: data.remarks || "",
      corrigendumInfo: data.corrigendumInfo || "",
      OperatorId: "291536",
      OperatorName: "Vivek Kumar Singh",
      OperatorRole: "Lead Owner",
      OperatorSBU: "Software SBU",
      submittedAt: new Date().toISOString(),
    };

    console.log(
      "Frontend Form Data:",
      JSON.stringify(formattedData, null, 2)
    );

    // Old console block kept as comment:
    // console.log(
    //   "Budgetary Quotation Data:",
    //   JSON.stringify(formattedData, null, 2)
    // );

    axios
      .post(SaveDataURL, formattedData)
      .then((response) => {
        // console.log("formattedData after ")
        console.log("Server Response:", response.data);
        setSubmittedData(formattedData);
        setSubmitSuccess(true);
      })
      .catch((error) => console.log(error.message));
  };

  // 🔁 OLD DUPLICATE onSubmit KEPT AS COMMENT
  /*
  const onSubmit = (data) => {

  console.log(data);

  // Convert string numbers to actual numbers with 2 decimal precision

  const formattedData = {

  leadID: data.leadID,

  issueDate: data.issueDate,

  tenderName: data.tenderName,

  organisation: data.organisation,

  document Type: data.document Type,

  tenderType: data.tenderType,

  emdInCrore: parseFloat(parseFloat(data.emdCrore).toFixed(5)),

  approx TenderValueCrore:

  parseFloat(parseFloat(data.approxTenderValueCrore).toFixed(5)), // emdInCrore:data.emdInCrore,

  //approxTenderValueCrore:data.approxTenderValueCrore,

  lastDateSubmission: data.lastDateSubmission,

  preBidDate: data.preBidDate,

  teamAssigned: data.teamAssigned,

  remarks: data.remarks || "",

  corrigendumInfo: data.corrigendumInfo || "",

  OperatorId: "291536",

  OperatorName: "Vivek Kumar Singh",

  OperatorRole: "Lead Owner",

  OperatorSBU: "Software SBU",

  }; submittedAt: new Date().toISOString(),

  2)); console.log("Frontend Form Data:", JSON.stringify(formattedData, null,

  // console.log(
  // "Budgetary Quotation Data:",
  // JSON.stringify(formattedData, null, 2)
  //);

  axios

  .post(SaveDataURL, formattedData)

  .then((response) => {

  // console.log("formattedData after ")

  console.log(response.data);

  setSubmittedData(formattedData);

  setSubmitSuccess(true);

  }; }) .catch((error) => console.log(error.message));
  };
  */

  // RESET
  const handleReset = () => {
    reset();
    setSubmittedData(null);
  };

  // Old style kept as comment:
  // const handleReset = () => { }; reset(); setSubmittedData(null);

  // SNACKBAR CLOSE
  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  // Old style kept:
  // const handleCloseSnackbar = () => { }; setSubmitSuccess(false);

  // DOWNLOAD JSON
  const handleDownloadJSON = () => {
    // Old commented logic kept:
    // if (submittedData) {
    // const dataStr = JSON.stringify(submittedData, null, 2);
    // const dataBlob = new Blob([dataStr], { type: "application/json" });
    // const url = URL.createObjectURL(dataBlob); const link document.createElement("a"); link.href url; link.download budgetary-quotation-$( submittedData.serialNumber }-${Date.now()).json"; link.click(); URL.revokeObjectURL(url);

    if (!submittedData) return;

    const dataStr = JSON.stringify(submittedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    // We don't know serialNumber exists; use timestamp only:
    link.download = `budgetary-quotation-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    axios
      .get(GetDataURL)
      .then((response) => {
        // console.log("formattedData after ")
        //console.log(response.data);
        setOrderData(response.data);
      })
      .catch((error) => console.log(error.message));
    // ), [SaveDataURL]);
  }, [GetDataURL]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 50%, #fff 100%)",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          mb: 3,
          backgroundColor: "rgba(255,255,255,0.98)",
        }}
      >
        <Tabs
          value={value}
          onChange={(e, v) => setValue(v)}
          sx={{
            mb: 1,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: 14,
            },
          }}
          variant="fullWidth"
        >
          <Tab label="Create CRM Lead" />
          <Tab label="View CRM Leads" />
        </Tabs>
      </Paper>

      {value === 0 && (
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.98)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: 0.8,
                mb: 1,
              }}
            >
              CRM Leads Form
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fill all details below to submit the CRM lead form
            </Typography>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card sx={cardSx}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={sectionTitleSx}
                >
                  CRM Lead Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  {[
                    ["leadID", "Lead ID"],
                    ["issueDate", "Issue Date", "date"],
                    ["tenderName", "Tender Name"],
                    ["organisation", "Organisation"],
                  ].map(([name, label, type]) => (
                    <Grid item xs={12} md={6} key={name}>
                      <Controller
                        name={name}
                        control={control}
                        rules={{ required: `${label} is required` }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            type={type || "text"}
                            label={label}
                            required
                            InputLabelProps={{ shrink: true }}
                            sx={textFieldSx}
                            error={!!errors[name]}
                            helperText={errors[name]?.message}
                          />
                        )}
                      />
                    </Grid>
                  ))}

                  {/* Document Type */}
                  <Grid item xs={12} md={6}>
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
                          required
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                          error={!!errors.documentType}
                          helperText={errors.documentType?.message}
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

                  {/* Tender Type */}
                  <Grid item xs={12} md={6}>
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
                          required
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                          error={!!errors.tenderType}
                          helperText={errors.tenderType?.message}
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

                  {/* EMD Value */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="emdInCrore"
                      control={control}
                      rules={{ required: "EMD value is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          // type="number"
                          label="EMD in Crore"
                          required
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                          error={!!errors.emdInCrore}
                          helperText={errors.emdInCrore?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Approx Tender Value */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="approxTenderValueCrore"
                      control={control}
                      rules={{
                        required: "Approx Tender Value is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          // type="number"
                          label="Approx Tender Value in Crore"
                          required
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                          error={!!errors.approxTenderValueCrore}
                          helperText={
                            errors.approxTenderValueCrore?.message
                          }
                        />
                      )}
                    />
                  </Grid>

                  {/* Last Date of Submission */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="lastDateSubmission"
                      control={control}
                      rules={{
                        required:
                          "Last Date of Submission is required",
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          fullWidth
                          label="Last Date of Submission"
                          required
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                          error={!!errors.lastDateSubmission}
                          helperText={
                            errors.lastDateSubmission?.message
                          }
                        />
                      )}
                    />
                  </Grid>

                  {/* Pre Bid Date */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="preBidDate"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="datetime-local"
                          fullWidth
                          label="Pre-bid Date & Time"
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                        />
                      )}
                    />
                  </Grid>

                  {/* Team Assigned */}
                  <Grid item xs={12}>
                    <Controller
                      name="teamAssigned"
                      control={control}
                      rules={{ required: "Team Assigned is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Team Assigned"
                          required
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                          error={!!errors.teamAssigned}
                          helperText={errors.teamAssigned?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Remarks */}
                  <Grid item xs={12}>
                    <Controller
                      name="remarks"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={2}
                          label="Remarks"
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                        />
                      )}
                    />
                  </Grid>

                  {/* Corrigendum */}
                  <Grid item xs={12}>
                    <Controller
                      name="corrigendumInfo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Corrigendums Date & File"
                          InputLabelProps={{ shrink: true }}
                          sx={textFieldSx}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* BUTTONS */}
            <Box
              sx={{
                textAlign: "center",
                mt: 5,
                display: "flex",
                justifyContent: "center",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  borderRadius: 999,
                  px: 4,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: 3,
                }}
              >
                Submit
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 999,
                  px: 4,
                  textTransform: "none",
                  fontWeight: 500,
                }}
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </form>

          {/* SUCCESS SNACKBAR */}
          <Snackbar
            open={submitSuccess}
            autoHideDuration={4500}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity="success"
              sx={{ width: "100%" }}
            >
              CRM Lead submitted successfully!
            </Alert>
          </Snackbar>

          {/* JSON PREVIEW */}
          {submittedData && (
            <Box sx={{ mt: 6 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Typography variant="h6">
                  Submitted Data (JSON)
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={handleDownloadJSON}
                  sx={{ textTransform: "none", borderRadius: 999 }}
                >
                  Download JSON
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  backgroundColor: "#f5f5f5",
                  maxHeight: 450,
                  overflow: "auto",
                  borderRadius: 2,
                  fontSize: 13,
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

      {value === 1 && <ViewCRMLeadData ViewData={orderData} />}
    </Container>
  );
};

function ViewCRMLeadData(props) {
  // Old debug:
  // console.log("props viewCRMLeadData", props. ViewData.data);

  const ViewData = props.ViewData;

  return (
    <>
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          backgroundColor: "lavender",
        }}
      >
        <Typography
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            color: "#000",
            fontSize: "1.4rem",
            textSizeAdjust: "auto",
            textAlign: "center",
          }}
        >
          User Profile Created List
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Table aria-label="customized table" size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
              >
                LeadID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Issue Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Tender Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Organisation
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Document Type
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Tender Type
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                EMD in Cr
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Approx Tender Value in Cr
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Last Date of Submission
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Pre-bid Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Team Assigned
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Remarks
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bolder", fontSize: "15px", color: "common.white" }}
                align="left"
              >
                Corrigendum Date & File
              </TableCell>
              {/* 
              <TableCell style={{ fontweight: "bolder", fontSize: 15px' }}
              align="left">Created date</TableCell> 
              */}
            </TableRow>
          </TableHead>

          <TableBody>
            {ViewData?.data
              ? ViewData.data.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(0,0,0,0.02)",
                      },
                    }}
                  >
                    {/* (defaultValues: [
                      leadID:
                      issueDate:
                      tenderName:
                      organisation:
                      document Type:
                      tender Type:
                      emdInCrore:
                      approxTenderValueCrore:
                      lastDateSubmission:
                      preBidDate:
                      teamAssigned:
                      remarks:",
                      corrigendumInfo:"
                      }} */}
                    <TableCell component="th" scope="row">
                      {row.leadID}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.issueDate}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.tenderName}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.organisation}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.documentType}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.tenderType}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.emdInCrore}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.approxTenderValueCrore}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.lastDateSubmission}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.preBidDate}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.teamAssigned}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.remarks}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.corrigendumInfo}
                    </TableCell>
                    {/* <TableCell align="left">{row.dateCreated}</TableCell> */}
                  </TableRow>
                ))
              : ViewData?.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(0,0,0,0.02)",
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.leadID}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.issueDate}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.tenderName}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.organisation}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.documentType}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.tenderType}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.emdInCrore}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.approxTenderValueCrore}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.lastDateSubmission}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.preBidDate}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.teamAssigned}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.remarks}
                    </TableCell>
                    <TableCell
                      style={{ fontSize: "14px" }}
                      align="left"
                    >
                      {row.corrigendumInfo}
                    </TableCell>
                    {/* <TableCell align="left">{row.dateCreated}</TableCell> */}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CRMLeadForm;
