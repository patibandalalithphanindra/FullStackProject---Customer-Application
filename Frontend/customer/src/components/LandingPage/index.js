import React from 'react';
import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';

function LandingPage() {
  const cardStyle = {
    cursor: 'pointer',
    marginBottom: '20px',
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  }
   return (
    <div>
        <Button onClick={handleLogout}>Logout</Button>
      <Typography variant="h4" align="center" gutterBottom>
        Choose among the below
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Link to="/customer" style={{ textDecoration: 'none' }}>
            <Card style={cardStyle}>
              <CardContent>
                <Typography variant="h5">Customer</Typography>
                <Typography variant="body2">Click here to view Customer information.</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Link to="/order" style={{ textDecoration: 'none' }}>
            <Card style={cardStyle}>
              <CardContent>
                <Typography variant="h5">Order</Typography>
                <Typography variant="body2">Click here to view Order details.</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Link to="/rewards" style={{ textDecoration: 'none' }}>
            <Card style={cardStyle}>
              <CardContent>
                <Typography variant="h5">Rewards</Typography>
                <Typography variant="body2">Click here to check Rewards status.</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default LandingPage;
