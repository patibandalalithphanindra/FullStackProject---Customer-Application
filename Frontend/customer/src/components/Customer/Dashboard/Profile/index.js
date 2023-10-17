import React from "react";
import { Card, CardContent, Avatar, Typography, Grid } from "@mui/material";
import styles from "./styles.module.css";

function Profile({ customer }) {
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
    status,
  } = customer;

  return (
    <Card style={{ backgroundColor: "#f9f9f9" }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={2} marginLeft={2}>
            <Avatar
              src="https://www.pngitem.com/pimgs/m/62-625606_computer-icons-suit-image-avatar-clip-art-customer.png"
              alt="Customer Avatar"
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
          <Grid item xs={5} className={styles.head}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography color="textPrimary" className={styles.profile}>
                <b> Name : </b> {firstName} {lastName}
              </Typography>
              <Typography color="textPrimary" className={styles.profile}>
                <b> Mobile Number : </b> {phoneNo}
              </Typography>
              <Typography color="textPrimary" className={styles.profile}>
                <b> Email Id : </b> {emailId}
              </Typography>
              <Typography color="textPrimary" className={styles.profile}>
                <b> Status : </b> {status}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography color="textPrimary" className={styles.address}>
                <b>Address : </b> {addressLine1}, {addressLine2}
              </Typography>
              <Typography color="textPrimary" className={styles.address}>
                <b>City : </b> {city}
              </Typography>
              <Typography color="textPrimary" className={styles.address}>
                <b> State : </b> {state}
              </Typography>
              <Typography color="textPrimary" className={styles.address}>
                <b>Country : </b> {country}
              </Typography>
              <Typography color="textPrimary" className={styles.address}>
                <b> Zip Code : </b> {zipCode}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default Profile;
