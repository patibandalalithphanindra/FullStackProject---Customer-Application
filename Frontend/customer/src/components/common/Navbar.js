import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Button, Modal, Box } from '@mui/material';
import styles from './styles.module.css';
import { toast } from 'react-toastify';

function Navbar() {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    toast.success('Logged out Succesfully!', { autoClose: 2000 });
  };

  return (
    <div className={styles.header}>
      <Typography variant="h6" style={{ color: '#fff' }}>
        <Link to="/homepage" style={{ textDecoration: 'none', color: 'white' }}>
          Customer Management System
        </Link>
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={openLogoutModal}
      >
        Logout
      </Button>

      <Modal
        open={isLogoutModalOpen}
        onClose={closeLogoutModal}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box className={styles.modal}>
          <Typography variant="h6" id="logout-modal-title" className={styles.modalTitle}>
            Confirm Logout
          </Typography>
          <Typography id="logout-modal-description" className={styles.modalDescription}>
            Do you want to logout for sure?
          </Typography>
          <div className={styles.modalActions}>
            <Button onClick={closeLogoutModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleLogout} color="error">
              Logout
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Navbar;
