import React, { useState } from "react";
import { 
  Button, 
  Container, 
  TextField, 
  Typography, 
  Box,
  InputAdornment,
  IconButton,
  Divider,
  useTheme
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Lock 
} from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login({ toggleForm }) {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/user/authenticate",
        formData
      );
      if (response.status === 200) {
        localStorage.setItem("jwt", response?.data?.token);
        localStorage.setItem("name", response?.data?.name);
        navigate("/homepage");
        toast.success("Logged in Successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ px: 0 }}>
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 1
          }}
        >
          Sign In
        </Typography>
      </Box>
      
      <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
        <TextField
          label="Username"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          data-testid="username"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
          data-testid="password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
        
        <Button
          type="submit"
          variant="contained"
          color="primary"
          data-testid="login"
          fullWidth
          disabled={loading}
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            mb: 3,
            background: loading ? undefined : 'linear-gradient(45deg, #1976d2, #42a5f5)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
            },
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
        
        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            New user?{" "}
            <Typography
              component="span"
              variant="body2"
              onClick={toggleForm}
              sx={{
                color: theme.palette.primary.main,
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline',
                '&:hover': {
                  color: theme.palette.primary.dark,
                },
              }}
            >
              Create an account
            </Typography>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;

