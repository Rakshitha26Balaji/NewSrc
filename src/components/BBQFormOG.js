import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  TableBody,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Container,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import axios from "axios";

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    "& fieldset": {
      borderColor: "#c6cfe1",
    },
    "&:hover fieldset": {
      borderColor: "#7ba4ff",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      borderWidth: "2px",
    },
  },
};

const cardStyle = {
  mb: 3,
  backgroundColor: "#f4f7ff",
  border: "1px solid #d8e1f5",
  borderRadius: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  p: 2,
};

const sectionTitleStyle = {
  fontWeight: 600,
  mb: 1,
  color: "#1a4fbf",
  letterSpacing: "0.3px",
};

const BudgetaryQuotationForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [value, setValue] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [ServerIp, SetServerIp] = useState("");

  const API = "/getBudgetaryQuoatation";
  let user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get(`/config.json`)
      .then(function (response) {
        SetServerIp(response.data.project[0].ServerIP[0].NodeServerIP + API);
        axios
          .get(response.data.project[0].ServerIP[0].NodeServerIP + API)
          .then((response) => {
            setOrderData(response.data);
          })
          .catch((error) => console.log(error.message));
      })
      .catch(function () {
        SetServerIp("172.195.120.135");
      });
  }, []);

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
    "",
  ];

  const onSubmit = (data) => {
    const formattedData = {
      ...data,
      estimateValueInCrWithoutGST: parseFloat(
        parseFloat(data.estimateValueInCrWithoutGST).toFixed(2)
      ),
      submittedValueInCrWithoutGST: parseFloat(
        parseFloat(data.submittedValueInCrWithoutGST).toFixed(2)
      ),
      submittedAt: new Date().toISOString(),
      OperatorId: user.id || "291536",
      OperatorName: user.username || "Vivek Kumar Singh",
      OperatorRole: user.userRole || "Lead Owner",
      OperatorSBU: "Software SBU",
    };

    axios
      .post(ServerIp, formattedData)
      .then(() => {
        setSubmittedData(formattedData);
        setSubmitSuccess(true);
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        pb: 4,
        mb: 6,
        background: "linear-gradient(to bottom right, #e9f1ff, #ffffff)",
        borderRadius: 4,
        mt: 2,
        p: 3,
      }}
    >
      <Tabs value={value} onChange={(e, v) => setValue(v)}>
        <Tab
          label="Create Data"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
          }}
        />
        <Tab
          label="View Data"
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
          }}
        />
      </Tabs>

      {value === 0 && (
        <Paper
          sx={{
            p: { xs: 2, sm: 4 },
            backgroundColor: "#ffffff",
            mt: 2,
            width: "100%",
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              color: "#1a4fbf",
              mb: 1,
            }}
          >
            Budgetary Quotation Form
          </Typography>

          <Box
            sx={{
              height: "3px",
              width: "100%",
              backgroundColor: "#1a4fbf",
              mb: 4,
            }}
          ></Box>

          {/* FORM START */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* SECTION 1 */}
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" sx={sectionTitleStyle}>
                  BQ Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
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
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
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
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
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
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
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
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* SECTION 2 */}
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" sx={sectionTitleStyle}>
                  Classification & Financial Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Controller
                      name="defenceAndNonDefence"
                      control={control}
                      rules={{ required: "Classification is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Defence / Non-Defence"
                          fullWidth
                          sx={{ ...textFieldStyle, minWidth: 220 }}
                          required
                          error={!!errors.defenceAndNonDefence}
                          helperText={errors.defenceAndNonDefence?.message}
                        >
                          {defenceAndNonDefenceOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="estimateValueInCrWithoutGST"
                      control={control}
                      rules={{ required: "Estimated Value is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Estimate Without GST"
                          fullWidth
                          required
                          error={!!errors.estimateValueInCrWithoutGST}
                          helperText={
                            errors.estimateValueInCrWithoutGST?.message
                          }
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="submittedValueInCrWithoutGST"
                      control={control}
                      rules={{ required: "Submitted Value is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Submitted Value"
                          fullWidth
                          required
                          error={!!errors.submittedValueInCrWithoutGST}
                          helperText={
                            errors.submittedValueInCrWithoutGST?.message
                          }
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* SECTION 3 */}
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" sx={sectionTitleStyle}>
                  Additional Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="referenceNo"
                      control={control}
                      rules={{ required: "Reference Number is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Reference Number"
                          fullWidth
                          required
                          error={!!errors.referenceNo}
                          helperText={errors.referenceNo?.message}
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="dateOfLetterSubmission"
                      control={control}
                      rules={{ required: "Date is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="date"
                          label="Date of Submission"
                          fullWidth
                          required
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.dateOfLetterSubmission}
                          helperText={errors.dateOfLetterSubmission?.message}
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Controller
                      name="presentStatus"
                      control={control}
                      rules={{ required: "Status is required" }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          label="Present Status"
                          fullWidth
                          sx={{ ...textFieldStyle, minWidth: 220 }}
                          required
                          error={!!errors.presentStatus}
                          helperText={errors.presentStatus?.message}
                        >
                          {statusOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={8} sx={{ minHeight: 100 }}>
                    <Controller
                      name="JSON_competitors"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Competitors (Optional)"
                          fullWidth
                          multiline
                          rows={2}
                          placeholder="Company A, Company B..."
                          sx={{
                            ...textFieldStyle,
                            minWidth: 500,
                            "& .MuiInputBase-root": {
                              minHeight: 60,
                            },
                          }}
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
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mt: 4,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ px: 5 }}
              >
                Submit BQ
              </Button>

              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={() => reset()}
                sx={{ px: 5 }}
              >
                Reset Form
              </Button>
            </Box>
          </form>

          {/* SUCCESS MESSAGE */}
          <Snackbar
            open={submitSuccess}
            autoHideDuration={6000}
            onClose={() => setSubmitSuccess(false)}
          >
            <Alert severity="success">Form submitted successfully!</Alert>
          </Snackbar>

          {/* JSON OUTPUT */}
          {submittedData && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Submitted JSON Data
              </Typography>

              <Paper
                sx={{
                  p: 3,
                  backgroundColor: "#1e1e1e",
                  color: "#d4d4d4",
                  borderRadius: 2,
                  fontFamily: "monospace",
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

      {/* VIEW TABLE */}
      {value === 1 && orderData && (
        <ViewBudgetaryQuotationData ViewData={orderData} />
      )}
    </Container>
  );
};

function ViewBudgetaryQuotationData(props) {
  return (
    <>
      <Typography
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          backgroundColor: "lavender",
          p: 1,
          fontSize: "1.4rem",
          mt: 3,
        }}
      >
        Budgetary Quotation Records
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2, width: "100%" }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              {[
                "BqTitle",
                "Customer Name",
                "Customer Address",
                "Lead Owner",
                "Defence/Non Defence",
                "Estimate Value",
                "Submitted Value",
                "Date Of Submission",
                "Reference No",
                "Competitors",
                "Present Status",
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{ fontWeight: 700, fontSize: "15px" }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {props.ViewData.data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.bqTitle}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.customerAddress}</TableCell>
                <TableCell>{row.leadOwner}</TableCell>
                <TableCell>{row.defenceAndNonDefence}</TableCell>
                <TableCell>{row.estimateValueInCrWithoutGST}</TableCell>
                <TableCell>{row.submittedValueInCrWithoutGST}</TableCell>
                <TableCell>{row.dateOfLetterSubmission}</TableCell>
                <TableCell>{row.referenceNo}</TableCell>
                <TableCell>{row.JSON_competitors}</TableCell>
                <TableCell>{row.presentStatus}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default BudgetaryQuotationForm;
