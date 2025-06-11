import React, { useState } from "react";
import { 
  Paper, 
  Typography, 
  Box, 
  Container,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";
import Login from "../Login";
import Register from "../Register";

function HomePage() {
  const [showLogin, setShowLogin] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing(2),
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper 
            elevation={6}
            sx={{
              padding: theme.spacing(4, 3),
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: theme.spacing(3),
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Welcome Back
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ fontSize: '1.1rem' }}
              >
                {showLogin ? 'Sign in to your account' : 'Create your new account'}
              </Typography>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              {showLogin ? (
                <Login toggleForm={toggleForm} />
              ) : (
                <Register toggleForm={toggleForm} />
              )}
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default HomePage;

