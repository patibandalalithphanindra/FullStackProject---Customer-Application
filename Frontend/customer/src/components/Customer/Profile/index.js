import React from 'react';
import { Card, CardContent, Avatar, Typography, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

import styles from './styles.module.css'; // Make sure to import your CSS module

const Profile = ({ customer }) => {
  const {
    firstName,
    lastName,
    emailId,
    phoneNo,
    addressLine1,
    addressLine2,
    city,
    state,
    zipCode,
    country,
  } = customer;

  return (
    <Card elevation={3} className={styles.profileContainer}>
      <CardContent>
      <Grid container spacing={3}>
          <Grid item xs={12} sm={6} className={styles.leftColumn}>
            <div className={styles.leftContent}>
              <div className={styles.avatarContainer}>
                <Avatar className={styles.largeAvatar}>
                  <PersonIcon fontSize="large" />
                </Avatar>
              </div>
              <div className={styles.info}>
                <Typography variant="h6" className={styles.fullName}>
                  {firstName} {lastName}
                </Typography>
                <Typography variant="body1" className={styles.verticalText}>
                  {emailId}
                </Typography>
                <Typography variant="body1" className={styles.verticalText}>
                  {phoneNo}
                </Typography>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} className={styles.rightColumn}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body1" className={styles.boldLabel}>
                  Address:
                </Typography>
                <Typography variant="body1" className={styles.fieldValue}>
                  {addressLine1}, {addressLine2}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" className={styles.boldLabel}>
                  City:
                </Typography>
                <Typography variant="body1" className={styles.fieldValue}>
                  {city}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" className={styles.boldLabel}>
                  State:
                </Typography>
                <Typography variant="body1" className={styles.fieldValue}>
                  {state}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" className={styles.boldLabel}>
                  Zip Code:
                </Typography>
                <Typography variant="body1" className={styles.fieldValue}>
                  {zipCode}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1" className={styles.boldLabel}>
                  Country:
                </Typography>
                <Typography variant="body1" className={styles.fieldValue}>
                  {country}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Profile;
