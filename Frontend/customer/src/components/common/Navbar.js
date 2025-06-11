import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider
} from "@mui/material";
import {
  Logout as LogoutIcon,
  ArrowBack,
  Dashboard,
  Person,
  AccountCircle,
  Home
} from "@mui/icons-material";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const userName = localStorage.getItem("name") || "User";
  const isMenuOpen = Boolean(anchorEl);

  const goBack = () => {
    navigate(-1);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
    handleMenuClose();
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    toast.success("Logged out successfully!", {
      position: toast.POSITION.BOTTOM_RIGHT,
      autoClose: 3000,
    });
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/homepage') return 'Dashboard';
    if (path === '/customers') return 'Customer Management';
    if (path === '/orders') return 'Order Management';
    if (path === '/rewards') return 'Rewards System';
    if (path.includes('/dashboard/')) return 'Customer Dashboard';
    return 'Order Management System';
  };

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 200,
          borderRadius: 2,
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        }
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {userName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administrator
        </Typography>
      </Box>
      <Divider />
      <MenuItem 
        onClick={() => { navigate('/homepage'); handleMenuClose(); }}
        sx={{ py: 1.5 }}
      >
        <Home sx={{ mr: 2 }} />
        Dashboard
      </MenuItem>
      <MenuItem onClick={openLogoutModal} sx={{ py: 1.5, color: 'error.main' }}>
        <LogoutIcon sx={{ mr: 2 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Back Button and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            {location.pathname !== '/homepage' && (
              <IconButton
                onClick={goBack}
                data-testid="back-button"
                sx={{ 
                  mr: 2, 
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
            )}
            
            <Box>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                component={Link}
                to="/homepage"
                sx={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: 700,
                  '&:hover': {
                    opacity: 0.9,
                  }
                }}
              >
                {isMobile ? 'OMS' : 'Order Management System'}
              </Typography>
              {!isMobile && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.875rem'
                  }}
                >
                  {getPageTitle()}
                </Typography>
              )}
            </Box>
          </Box>

          {/* User Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  mr: 1
                }}
              >
                Welcome, {userName}
              </Typography>
            )}
            
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderProfileMenu}

      {/* Logout Confirmation Dialog */}
      <Dialog 
        open={isLogoutModalOpen} 
        onClose={closeLogoutModal}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 320,
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LogoutIcon color="error" />
            <Typography variant="h6" component="span">
              Confirm Logout
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1rem' }}>
            Are you sure you want to logout? You'll need to sign in again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={closeLogoutModal} 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogout} 
            variant="contained"
            color="error" 
            data-testid="logout"
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar;

