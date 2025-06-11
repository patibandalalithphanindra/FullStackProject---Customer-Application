import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const LoadingSpinner = ({ 
  size = 40, 
  message = "Loading...", 
  fullScreen = false,
  color = "primary" 
}) => {
  const theme = useTheme();

  const containerStyles = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(4px)',
    zIndex: 9999,
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
  };

  return (
    <Box sx={containerStyles}>
      <CircularProgress 
        size={size} 
        color={color}
        sx={{
          mb: 2,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          }
        }}
      />
      {message && (
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: 300
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;

