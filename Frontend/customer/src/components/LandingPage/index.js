import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent,
  Typography,
  Container,
  Fade,
  Skeleton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  CheckCircleOutline,
  FlightTakeoff,
  LocalShipping,
  People,
  ShoppingCart,
  Star,
  LocalMall,
  DescriptionTwoTone,
  TrendingUp,
  Assessment,
  PersonAdd
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Navbar from "../common/Navbar";

function LandingPage() {
  const [counts, setCounts] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchCustomerData = () => {
    const response = localStorage.getItem("jwt");
    const headers = {
      Authorization: `Bearer ${response}`,
      "Content-Type": "application/json",
    };

    Promise.all([
      axios.get("http://localhost:8080/customers/counts", { headers }),
      axios.get("http://localhost:8080/orders/statuscounts", { headers })
    ])
    .then(([countsResponse, statusResponse]) => {
      setCounts(countsResponse.data);
      setStatusCounts(statusResponse.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const StatCard = ({ icon, title, value, color = "primary", gradient }) => (
    <Fade in timeout={600}>
      <Card
        sx={{
          height: '100%',
          background: gradient || `linear-gradient(135deg, ${theme.palette[color].light}20, ${theme.palette[color].main}10)`,
          border: `1px solid ${theme.palette[color].light}40`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${theme.palette[color].main}25`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: theme.palette[color].main,
                  mb: 1
                }}
              >
                {loading ? <Skeleton width={60} /> : value}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {title}
              </Typography>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                background: `${theme.palette[color].main}15`,
                color: theme.palette[color].main,
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );

  const NavigationCard = ({ to, title, description, icon, color = "primary" }) => (
    <Fade in timeout={800}>
      <Card
        component={Link}
        to={to}
        sx={{
          textDecoration: 'none',
          height: '100%',
          background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.grey[50]})`,
          border: `1px solid ${theme.palette.grey[200]}`,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: `0 12px 30px ${theme.palette[color].main}20`,
            borderColor: theme.palette[color].light,
          },
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              background: `${theme.palette[color].main}15`,
              color: theme.palette[color].main,
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 40 } })}
          </Box>
          <Typography 
            variant="h5" 
            component="h3"
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 2
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <Navbar />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h1"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              mb: 2,
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Monitor your business metrics and manage your operations efficiently
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 3
            }}
          >
            Key Metrics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<People sx={{ fontSize: 32 }} />}
                title="Total Customers"
                value={counts[0] || 0}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<ShoppingCart sx={{ fontSize: 32 }} />}
                title="Orders Placed"
                value={counts[1] || 0}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<Star sx={{ fontSize: 32 }} />}
                title="Rewards Issued"
                value={counts[2] || 0}
                color="warning"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Order Status Cards */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 3
            }}
          >
            Order Status Breakdown
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                icon={<DescriptionTwoTone sx={{ fontSize: 28 }} />}
                title="Created"
                value={statusCounts?.Created || 0}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                icon={<LocalMall sx={{ fontSize: 28 }} />}
                title="Packed"
                value={statusCounts?.Packed || 0}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                icon={<FlightTakeoff sx={{ fontSize: 28 }} />}
                title="Shipped"
                value={statusCounts?.Shipped || 0}
                color="secondary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                icon={<LocalShipping sx={{ fontSize: 28 }} />}
                title="In Transit"
                value={statusCounts?.["In Transit"] || 0}
                color="warning"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                icon={<CheckCircleOutline sx={{ fontSize: 28 }} />}
                title="Delivered"
                value={statusCounts?.Delivered || 0}
                color="success"
              />
            </Grid>
          </Grid>
        </Box>

        {/* Navigation Cards */}
        <Box>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 3
            }}
          >
            Quick Actions
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <NavigationCard
                to="/customers/"
                title="Customer Management"
                description="View and manage customer information, profiles, and account details"
                icon={<PersonAdd />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <NavigationCard
                to="/orders/"
                title="Order Management"
                description="Track orders, update status, and manage order fulfillment"
                icon={<Assessment />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <NavigationCard
                to="/rewards/"
                title="Rewards System"
                description="Monitor reward points, issue new rewards, and track redemptions"
                icon={<TrendingUp />}
                color="warning"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default LandingPage;

