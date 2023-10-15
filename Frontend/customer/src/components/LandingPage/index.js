import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Paper, Box } from "@mui/material";
import {
  CheckCircleOutline,
  FlightTakeoff,
  LocalShipping,
  People,
  ShoppingCart,
  Star,
  LocalMall,
  DescriptionTwoTone,
} from "@mui/icons-material";
import { Card, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import Navbar from "../common/Navbar";

function LandingPage() {
  const [counts, setCounts] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});

  const fetchCustomerData = () => {
    const response = localStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${response}`,
      "Content-Type": "application/json",
    };

    axios
      .get("http://localhost:8080/customers/counts", { headers })
      .then((response) => {
        setCounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching customer counts data:", error);
      });

    axios
      .get("http://localhost:8080/orders/statuscounts", { headers })
      .then((response) => {
        setStatusCounts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching order status counts data:", error);
      });
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <div>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            width: "300",
            marginTop: "20px",
            marginLeft: "134px",
            marginRight: "134px",
            backgroundColor: "#ADE7BF",
          }}
        >
          <Grid align="center" container spacing={6}>
            <Grid item xs={4}>
              <Box display="flex" alignItems="center">
                <People sx={{ fontSize: 60 }} />
                &nbsp; &nbsp;
                <div>
                  <Typography variant="h6">Customers</Typography>
                  <Typography variant="subtitle1">{counts[0]} </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" alignItems="center">
                <ShoppingCart color="primary" sx={{ fontSize: 60 }} />
                &nbsp; &nbsp;
                <div>
                  <Typography variant="h6">Orders Placed</Typography>
                  <Typography variant="subtitle1">{counts[1]} </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" alignItems="center">
                <Star color="gold" sx={{ fontSize: 60 }} />
                &nbsp; &nbsp;
                <div>
                  <Typography variant="h6">Rewards Issued</Typography>
                  <Typography variant="subtitle1">{counts[2]} </Typography>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            width: "300",
            marginTop: "20px",
            marginLeft: "134px",
            marginRight: "134px",
            backgroundColor: "#EAEAFA",
          }}
        >
          <Grid align="center" container spacing={6}>
            <Grid item xs={4}>
              <Box display="flex" alignItems="center">
                <DescriptionTwoTone color="primary" sx={{ fontSize: 60 }} />
                &nbsp; &nbsp;
                <div>
                  <Typography variant="h6">Created</Typography>
                  <Typography variant="subtitle1">
                    {statusCounts?.Created || 0}
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" alignItems="center">
                <LocalMall color="primary" sx={{ fontSize: 60 }} />
                &nbsp; &nbsp;
                <div>
                  <Typography variant="h6">Packed</Typography>
                  <Typography variant="subtitle1">
                    {statusCounts?.["Packed"] || 0}
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" alignItems="center">
                <FlightTakeoff color="secondary" sx={{ fontSize: 60 }} />
                &nbsp; &nbsp;
                <div>
                  <Typography variant="h6">Shipped</Typography>
                  <Typography variant="subtitle1">
                    {statusCounts?.Shipped || 0}
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" alignItems="center">
                <LocalShipping color="action" sx={{ fontSize: 60 }} />
                &nbsp; &nbsp;
                <div>
                  <Typography variant="h6">In Transit</Typography>
                  <Typography variant="subtitle1">
                    {statusCounts?.["In Transit"] || 0}
                  </Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" alignItems="center">
                <CheckCircleOutline color="success" sx={{ fontSize: 60 }} />
                &nbsp; &nbsp;
                <div>
                  <Typography variant="h6">Delivered</Typography>
                  <Typography variant="subtitle1">
                    {statusCounts?.Delivered || 0}
                  </Typography>
                </div>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </div>
      <div className={styles.cardContainer}>
        <Link to="/customers/" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <Typography variant="h5">Customer</Typography>
              <Typography variant="body2">
                Click here to view Customer information.
              </Typography>
            </div>
          </Card>
        </Link>
        <Link to="/orders/" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <Typography variant="h5">Order</Typography>
              <Typography variant="body2">
                Click here to view Order details.
              </Typography>
            </div>
          </Card>
        </Link>
        <Link to="/rewards/" className={styles.cardLink}>
          <Card className={styles.card}>
            <div className={styles.cardContent}>
              <Typography variant="h5">Rewards</Typography>
              <Typography variant="body2">
                Click here to check Rewards status.
              </Typography>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
