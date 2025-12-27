import React, { useState } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Container,
} from "@mui/material";

// Icons
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import GroupsIcon from "@mui/icons-material/Groups";
import PublicIcon from "@mui/icons-material/Public";
import HubIcon from "@mui/icons-material/Hub";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import EngineeringIcon from "@mui/icons-material/Engineering";

// Forms
import BudgetaryQuotationForm from "../components/BudgetaryQuotationForm";
import LeadSubmittedForm from "../components/LeadSubmittedForm";
import DomesticLeadForm from "../components/DomesticLeadsForm";
import ExportLeadForm from "../components/ExportLeadsForm";
import CRMLeadForm from "../components/CRMForm";
import ReceivedDomesticOrder from "../components/OrderReceivedForm";
import LostForm from "../components/LostForm";
import FutureRDInitiative from "../components/FutureRDInitiative";

// Gradients
const gradients = [
  // Executive Navy (primary / hero)
  "linear-gradient(160deg, #03045e 0%, #023e8a 55%, #002855 100%)",

  // Corporate Blue
  "linear-gradient(155deg, #023e8a 0%, #00509d 60%, #003f88 100%)",

  // Calm professional (no cyan)
  "linear-gradient(150deg, #002855 0%, #023e8a 100%)",

  // Authority / strong action
  "linear-gradient(165deg, #03045e 0%, #001845 100%)",

  // Balanced mid-tone
  "linear-gradient(150deg, #023e8a 0%, #003566 100%)",

  // Subtle variation (still dark)
  "linear-gradient(155deg, #001d3d 0%, #003f88 100%)",

  // Deep elegant contrast
  "linear-gradient(160deg, #03045e 0%, #00296b 100%)",

  // Deep elegant contrast
  "linear-gradient(160deg, #03045e 0%, #00296b 100%)",
];

// Cards
const menuItems = [
  { title: "Budgetary Quotation", icon: <RequestQuoteIcon />, value: 0 },
  { title: "Lead Submitted", icon: <AssignmentTurnedInIcon />, value: 1 },
  { title: "Domestic Leads", icon: <GroupsIcon />, value: 2 },
  { title: "Export Leads", icon: <PublicIcon />, value: 3 },
  { title: "CRM Leads", icon: <HubIcon />, value: 4 },
  { title: "Order Received", icon: <FactCheckIcon />, value: 5 },
  { title: "Lost Form", icon: <ReportProblemIcon />, value: 6 },
  { title: "Future R&D Initiative", icon: <EngineeringIcon />, value: 7 },
];

export default function CrmPage() {
  const [value, setValue] = useState(null);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 6,
        background: "linear-gradient(135deg, #E3F2FD 0%, #F9FCFF 100%)",
      }}
    >
      {value === null && (
        <>
          <Typography
            variant="h3"
            fontWeight={900}
            mb={10}
            textAlign="center"
            sx={{
              letterSpacing: "0.6px", // subtle authority
              background: "linear-gradient(90deg, #08192b, #102a44)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              position: "relative",

              // subtle underline accent (formal, not flashy)
              "&::after": {
                content: '""',
                display: "block",
                width: "90px",
                height: "4px",
                margin: "14px auto 0",
                borderRadius: "2px",
                background: "linear-gradient(90deg, #08192b, #1f4b7a)",
                opacity: 0.85,
              },
            }}
          >
            Marketing Data Forms
          </Typography>

          {/* ✅ WIDTH-CONSTRAINED CONTAINER */}
          <Container maxWidth="lg">
            <Grid
              container
              justifyContent="center"
              columnSpacing={4}
              rowSpacing={3}
            >
              {menuItems.map((item, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3} // ✅ Forces 4 per row
                  key={item.title}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{
                      width: 260,
                      height: 230,
                      borderRadius: 4,
                      background: gradients[index],
                      color: "#fff",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.15)",
                      transition: "0.35s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 26px 60px rgba(0,0,0,0.25)",
                      },
                    }}
                  >
                    <CardActionArea
                      sx={{ height: "100%" }}
                      onClick={() => setValue(item.value)}
                    >
                      <CardContent
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 2.5,
                            width: 70,
                            height: 70,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.25)",
                          }}
                        >
                          {React.cloneElement(item.icon, {
                            sx: { fontSize: 38, color: "#fff" },
                          })}
                        </Box>

                        <Typography variant="h6" fontWeight={800}>
                          {item.title}
                        </Typography>

                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Open module
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      )}

      {value !== null && (
        <Box px={{ xs: 2, sm: 4 }}>
          <Typography
            sx={{
              mb: 3,
              cursor: "pointer",
              fontWeight: 600,
              color: "#1976D2",
            }}
            onClick={() => setValue(null)}
          >
            ← Back to Cards
          </Typography>

          {value === 0 && <BudgetaryQuotationForm />}
          {value === 1 && <LeadSubmittedForm />}
          {value === 2 && <DomesticLeadForm />}
          {value === 3 && <ExportLeadForm />}
          {value === 4 && <CRMLeadForm />}
          {value === 5 && <ReceivedDomesticOrder />}
          {value === 6 && <LostForm />}
          {value === 7 && <FutureRDInitiative />}
        </Box>
      )}
    </Box>
  );
}
