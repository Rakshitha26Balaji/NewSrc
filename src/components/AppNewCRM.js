import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import CustomFooter from "./CommonComponents/CustomFooter/CustomFooter";
import MainPage from "./Components/Dashboard/MainPage";
import MoreInfoPage from "./Components/Dashboard/MoreInfoPage";
import ErrorPage from "./Components/ErrorPage";
import LoginPage from "./Components/Login/LoginPage";

import CorrectionMainform from "./CommonComponents/CorrectionForm/CorrectionForm";
import CommonDatabaseUploadBulk from "./CommonComponents/DataBaseUpload/CommonDatabaseUploadBulk";

import InspectionPage from "./MESComponents/Barcode/InspectionPage";
import GrQrorBarCodeGenetion from "./MESComponents/Barcode/GrQrorBarCodeGenetion";

import MaterialInspectionPage from "./MESComponents/InspectionTeam/MaterialInspection/MaterialInspectionPage";
import InstrumentList from "./MESComponents/InspectionTeam/MaterialInspection/InstrumentList";

import UserProfileDetails from "./CommonComponents/UserProfile/UserProfileDetails";

import { connect, useSelector } from "react-redux";
import {
  getUserProfileData,
  getSubmitStatus,
} from "./Redux/Actions/UserProfileAction";

import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import axios from "axios";

import { useDispatch } from "react-redux";
import {
  getOperationData,
  getMaintenanceData,
  getTrainingData,
  getRepairData,
  getConfigDetails,
  getServerStatus,
  getMESData,
} from "./Redux/Actions";

import ExamQuizHeader from "./CommonComponents/CustomQuiz/ExamQuizHeader";
import ServerInfoPage from "./CommonComponents/ServerInfo/ServerInfoPage";
import UserProfileMain from "./Components/Profile/UserProfileMain";

import authHeader from "./Services/auth-header";
import { logout } from "./Redux/Actions/authUser";

// JSON fallback data
import MaintenanceDataDefault from "./Data/MaintenanceDataDefault.json";
import OperationDataDefault from "./Data/OperationDataDefault.json";
import RepairDataDefault from "./Data/RepairDataDefault.json";
import TrainingDataDefault from "./Data/TrainingDataDefault.json";
import MESDataDefault from "./Data/MESDataDefault.json";

import HAMSASBSMainNodeLayoutMain from "./Components/MaintenanceComponents/HAMSASSB/HAMSASBSMainNodeLayoutMain";

// ------------------------------------------------------
// ⭐ CRM MODULE – ADD YOUR PATH HERE
// TODO: Update CRM import path as per your folder structure
// ------------------------------------------------------
import CrmPage from "./CRMPageNew";

// CRM placeholder subpages (replace later with your real pages)
const BudgetaryQuotationPage = () => <h1>Budgetary Quotation Page</h1>;
const LeadSubmittedPage = () => <h1>Lead Submitted Page</h1>;
const DomesticLeadsPage = () => <h1>Domestic Leads Page</h1>;
// ------------------------------------------------------


function App(props) {
  const [loginStatus, setloginStatus] = useState(false);
  const [serverStatus, setserverStatus] = useState({});
  const [serverArr, setserverArr] = useState([]);

  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.AuthUserReducer);
  const configDetails = useSelector(
    (state) => state.MROTDataSavingReducer.configDetails
  );

  /* -------------------------------------------
     PROJECT & SERVER DEFAULT CONFIG
  ---------------------------------------------*/
  let ProjectType = "1";
  let ServerIP = "http://127.0.0.1:8081";

  if (configDetails?.project?.[0]?.ServerIP?.[0]?.NodeServerIP) {
    ServerIP = configDetails.project[0].ServerIP[0].NodeServerIP;
  }

  if (configDetails?.project?.[0]?.current_project?.split("/")[0] === "EON-51") {
    ProjectType = "2";
  }

  /* -------------------------------------------
     ACCESS CONTROL STATES
  ---------------------------------------------*/
  const [MaintenancePageAccess, SetMaintenancePageAccess] = useState(true);
  const [RepairPageAccess, SetRepairPageAccess] = useState(true);
  const [OperationPageAccess, SetOperationPageAccess] = useState(true);
  const [TrainingPageAccess, SetTrainingPageAccess] = useState(true);
  const [MESPageAccess, SetMESPageAccess] = useState(true);

  /* -------------------------------------------
     ROLES & PERMISSIONS 
  ---------------------------------------------*/
  useEffect(() => {
    if (props.loginStatus == 1 && currentUser) {
      const canAccessMaintenance =
        currentUser.admin === "Yes" ||
        [
          "System Maintainer",
          "System Supervisor",
          "Administrator",
          "System Officer",
        ].includes(currentUser.userRole);

      SetMaintenancePageAccess(canAccessMaintenance);
      SetRepairPageAccess(canAccessMaintenance);

      const canAccessOperation =
        currentUser.admin === "Yes" ||
        [
          "System Maintainer",
          "System Operator",
          "System Officer",
          "Administrator",
          "System Supervisor",
        ].includes(currentUser.userRole);

      SetOperationPageAccess(canAccessOperation);
      SetMESPageAccess(canAccessOperation);
    }
  }, [props.loginStatus, currentUser]);

  const logedIn = (val) => setloginStatus(val);

  /* -------------------------------------------
     SERVER STATUS CHECK – EVERY 10 MINUTES
  ---------------------------------------------*/
  useEffect(() => {
    setInterval(() => {
      axios
        .get(`${ServerIP}/checkServer`)
        .then((res) => setserverStatus(res.data))
        .catch(() =>
          setserverStatus({
            message: "Server Not Found!",
            time: new Date().toLocaleDateString(),
          })
        );
    }, 60000 * 10);
  }, []);

  useEffect(() => {
    const updatedArr = [serverStatus];
    setserverArr(updatedArr);
    dispatch(getServerStatus(updatedArr));
  }, [serverStatus]);

  /* -------------------------------------------
     FETCH CONFIG.JSON
  ---------------------------------------------*/
  const [path, setpath] = useState();
  const [searchPath, SetsearchPath] = useState("");
  const [openDefaultDialog, SetopenDefaultDialog] = useState(false);
  const [showInfo, setshowInfo] = useState(false);
  const [ConfigDetails, SetConfigDetails] = useState([]);

  useEffect(() => {
    axios
      .get(`/config.json`)
      .then((response) => {
        const project = response.data.project[0];
        setpath(project.current_project);
        SetsearchPath(project.search_path);

        SetConfigDetails(response.data);
        dispatch(getConfigDetails(response.data));
      })
      .catch(() => {
        setpath("LYNX/INS_TABAR/");
        dispatch(getConfigDetails(ConfigDetails.project));
        SetConfigDetails(ConfigDetails.project);
        SetopenDefaultDialog(true);
      });
  }, []);

  /* -------------------------------------------
     LOAD PROJECT-BASED JSON FILES
  ---------------------------------------------*/
  const [ResOperationData, SetResOperationData] = useState();
  const [ResMESData, SetResMESData] = useState();
  const [ResMaintenanceData, SetResMaintenanceData] = useState();
  const [ResRepairData, SetResRepairData] = useState();
  const [ResTrainingData, SetResTrainingData] = useState();

  useEffect(() => {
    if (!path) return;

    getResponseData("OperationData.json");
    getResponseData("MaintenanceData.json");
    getResponseData("RepairData.json");
    getResponseData("TrainingData.json");
    getResponseData("MESData.json");
  }, [path]);

  /* -------------------------------------------
     GENERIC JSON FETCH FUNCTION
  ---------------------------------------------*/
  const getResponseData = (dataName) => {
    const Name = dataName.split(".")[0];

    axios
      .get(`${process.env.PUBLIC_URL}/Projects/${path}DataConfig/${dataName}`)
      .then((response) => {
        const data = response.data;

        switch (Name) {
          case "OperationData":
            dispatch(getOperationData(data.operation));
            SetResOperationData(data.operation);
            break;

          case "MaintenanceData":
            dispatch(getMaintenanceData(data.maintenance));
            SetResMaintenanceData(data.maintenance);
            break;

          case "RepairData":
            dispatch(getRepairData(data.repair));
            SetResRepairData(data.repair);
            break;

          case "TrainingData":
            dispatch(getTrainingData(data.training));
            SetResTrainingData(data.training);
            break;

          case "MESData":
            dispatch(getMESData(data.mes));
            SetResMESData(data.mes);
            break;

          default:
            break;
        }
      })
      .catch(() => {
        // Default fallback
        switch (Name) {
          case "OperationData":
            SetResOperationData(OperationDataDefault.operation);
            dispatch(getOperationData(OperationDataDefault.operation));
            break;

          case "MaintenanceData":
            SetResMaintenanceData(MaintenanceDataDefault.maintenance);
            dispatch(getMaintenanceData(MaintenanceDataDefault.maintenance));
            break;

          case "RepairData":
            SetResRepairData(RepairDataDefault.repair);
            dispatch(getRepairData(RepairDataDefault.repair));
            break;

          case "TrainingData":
            SetResTrainingData(TrainingDataDefault.training);
            dispatch(getTrainingData(TrainingDataDefault.training));
            break;

          case "MESData":
            SetResMESData(MESDataDefault.mes);
            dispatch(getMESData(MESDataDefault.mes));
            break;
        }

        setpath("LYNX/INS_TABAR/");
        SetopenDefaultDialog(true);
      });
  };

  /* -------------------------------------------
     USER PROFILE FETCH ON LOGIN
  ---------------------------------------------*/
  useEffect(() => {
    if (props.loginStatus !== 1) return;

    axios
      .get(`${ServerIP}/users`, { headers: authHeader() })
      .then((response) => {
        if (response.data) dispatch(getUserProfileData(response.data));
      })
      .catch((error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          dispatch(getSubmitStatus("You are Unauthorized"));
          dispatch(logout(currentUser?.id));
        }
      });
  }, [props.status, props.loginStatus]);

  /* -------------------------------------------
     HANDLERS
  ---------------------------------------------*/
  const handleClose = () => SetopenDefaultDialog(false);
  const handleopen = () => {
    SetopenDefaultDialog(false);
    setshowInfo(true);
  };
  const handleCloseInfoDialog = () => setshowInfo(false);

  /* -------------------------------------------
     MAIN RENDER STARTS HERE
  ---------------------------------------------*/
  const isDataReady =
    ResOperationData &&
    ResMaintenanceData &&
    ResRepairData &&
    ResTrainingData &&
    ResMESData;

  return (
    <>
      {isDataReady && (
        <>
          <BrowserRouter>
            <Routes>
              {/* Login Page */}
              <Route path="/" element={<LoginPage />} />

              {(loginStatus || currentUser) && (
                <>
                  {/* MAIN LANDING PAGE */}
                  <Route path="/Main" element={<MainPage path={path} />} />

                  {/* -----------------------------------------
                     ⭐ CRM ROUTES (NEW)
                  ------------------------------------------*/}

                  <Route path="/crm" element={<CrmPage />} />

                  <Route
                    path="/budgetary-quotation"
                    element={<BudgetaryQuotationPage />}
                  />

                  <Route
                    path="/lead-submitted"
                    element={<LeadSubmittedPage />}
                  />

                  <Route
                    path="/domestic-leads"
                    element={<DomesticLeadsPage />}
                  />

                  {/* ----------------------------------------- */}

                  {/* SYSTEM CONFIGURATION */}
                  <Route
                    path="/ServerInfo"
                    element={<ServerInfoPage path={path} />}
                  />

                  <Route
                    path="/UserProfileDetails"
                    element={<UserProfileDetails path={path} />}
                  />

                  <Route
                    path="/Profile"
                    element={<UserProfileMain path={path} />}
                  />

                  {/* Default Redirect */}
                  <Route
                    path="*"
                    element={<LoginPage logedIn={logedIn} />}
                  />
                </>
              )}

              {/* Error page for non-existent routes */}
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </BrowserRouter>

          {/* FOOTER */}
          <br />
          <CustomFooter />

          {/* DEFAULT CONFIG POPUP */}
          <Dialog open={openDefaultDialog}>
            <DialogTitle>
              Do You want to Proceed with Default Parameters? Since Configured
              Project from Config File Does Not Exist in Build File, Default
              Ship Name is INS-TABAR from Lynx.
            </DialogTitle>
            <DialogActions>
              <Button variant="contained" onClick={handleClose}>
                Proceed
              </Button>
              <Button variant="contained" onClick={handleopen}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          {/* INFO POPUP */}
          <Dialog open={showInfo} maxWidth="xl" fullWidth>
            <DialogContent>
              <Box sx={{ flexGrow: 1 }}>
                <AppBar position="relative" sx={{ backgroundColor: "#091f53" }}>
                  <Toolbar>
                    <Typography
                      variant="h4"
                      sx={{ flexGrow: 1, color: "#fff", fontWeight: "bold" }}
                    >
                      Project Configuration Window
                    </Typography>

                    <Button variant="outlined" onClick={handleCloseInfoDialog}>
                      Cancel
                    </Button>
                  </Toolbar>
                </AppBar>
              </Box>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

/* -------------------------------------------
   UNAUTHORIZED MESSAGE PAGE
---------------------------------------------*/
function AuthorizationMessage() {
  const navigate = useNavigate();
  return (
    <center style={{ marginTop: "30rem" }}>
      <h1>YOU ARE NOT AUTHORIZED TO ACCESS THIS PAGE</h1>
      <Button
        sx={{
          backgroundColor: "tomato",
          color: "white",
          textTransform: "none",
          width: "5rem",
        }}
        onClick={() => navigate("/Main")}
      >
        <HomeIcon />
      </Button>
    </center>
  );
}

/* -------------------------------------------
   REDUX CONNECTION
---------------------------------------------*/
function mapStateToProps(state) {
  return {
    status: state.MROTDataSavingReducer.submitStatus,
    loginStatus: state.AuthUserReducer.LoginStatus,
  };
}

export default connect(mapStateToProps)(App);
