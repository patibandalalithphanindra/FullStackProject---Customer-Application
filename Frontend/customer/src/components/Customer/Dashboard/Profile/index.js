import React from 'react';
import { Card, CardContent, Avatar, Typography, Grid } from '@mui/material';

const Profile = ({ customer }) => {
  const {
    firstName,
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
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2} marginLeft={2}>
            <Avatar src={"https://www.pngitem.com/pimgs/m/62-625606_computer-icons-suit-image-avatar-clip-art-customer.png"} alt="Customer Avatar" sx={{ width: 150, height: 150 }} />
          </Grid>
          <Grid item xs={5}>
            <Typography variant="h5" component="div">
              {firstName}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {phoneNo}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {emailId}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" color="textSecondary">
              Address: {addressLine1}, {addressLine2}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              City: {city}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              State: {state}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Country: {country}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Zip Code: {zipCode}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Profile;
