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
import EngineeringIcon from "@mui/icons-material/Engineering";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

// Forms
import TPCRForm from "../components/TPCRForm";

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
  { title: "TPCR Form", icon: <EngineeringIcon />, value: 1 },
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
            Future R&D Initiatives
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
  <Box
    onClick={() => setValue(null)}
    sx={{
      width: 42,
      height: 42,
      mb: 3,
      borderRadius: "50%",
      background: "linear-gradient(135deg, #1976D2, #42a5f5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: "0 8px 20px rgba(25,118,210,0.35)",
      transition: "0.3s",
      "&:hover": {
        transform: "scale(1.08)",
        boxShadow: "0 14px 32px rgba(25,118,210,0.45)",
      },
    }}
  >
    <ArrowBackIosNewRoundedIcon sx={{ color: "#fff", fontSize: 20 }} />
  </Box>

  {value === 1 && <TPCRForm />}
</Box>

      )}
    </Box>
  );
}
