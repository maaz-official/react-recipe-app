import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom'; // Corrected: Link from react-router-dom
import { useLoginMutation } from '../slices/userApiSlice';
import { setCredential } from '../slices/authSlice';
import { toast } from 'react-toastify'; // Import toast
import Meta from '../components/Meta'; // Import Meta for SEO

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    height: 'auto',
    padding: '20px',
  },
}));

const LeftContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '50px',
  [theme.breakpoints.down('md')]: {
    padding: '20px',
  },
}));

const RightContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundImage: 'url("/assets/login.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  borderRadius: '0px 10px 0px 10px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: '12px 0',
  borderRadius: '30px',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#333',
  },
  '&:disabled': {
    backgroundColor: '#ccc',
  },
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
  padding: '12px 0',
  borderRadius: '30px',
  marginTop: '20px',
  border: '1px solid #e0e0e0',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: '#f9f9f9',
  },
}));

const OverlayText = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: '50px',
  left: '20px',
  color: '#fff',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.2rem',
  },
}));

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState(''); // For showing validation errors

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  // Form validation
  const validateForm = () => {
    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError(''); // Clear form errors before submission

    if (!validateForm()) {
      return; // If validation fails, return early
    }

    try {
      const userData = { email, password };
      const res = await login(userData).unwrap();
      dispatch(setCredential(res)); // Store user data in Redux
      navigate(redirect); // Redirect after successful login
      toast.success('Login successful!');
    } catch (err) {
      console.error('Login failed:', err);
      toast.error(err?.data?.message || err?.message || 'Login failed');
    }
  };

  return (
    <MainContainer>
      {/* Meta Component for SEO */}
      <Meta 
        title="Login - LazzyShop" 
        description="Login to access your LazzyShop account and start shopping for the best deals." 
        keywords="login, LazzyShop, sign in, user login"
      />

      {/* Left Side: Login Form */}
      <LeftContainer>
        <Box width="100%" maxWidth="400px">
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Welcome back!
          </Typography>
          <Typography variant="body2" sx={{ mb: 4 }}>
            The faster you fill up, the faster you get a ticket
          </Typography>

          {isLoading && <Loader />} {/* Display Loader when logging in */}
          {formError && <Typography color="error">{formError}</Typography>}

          <form onSubmit={submitHandler}>
            <StyledTextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <StyledTextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={<Checkbox color="default" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
                label="Remember me"
              />
              <Link to="/forgot-password" underline="hover"> {/* Corrected to use Link for navigation */}
                Forgot Password
              </Link>
            </Box>

            <StyledButton fullWidth type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <Loader size={20} /> : 'Sign In'}
            </StyledButton>

            <GoogleButton fullWidth>
              <GoogleIcon sx={{ mr: 1 }} /> Sign In with Google
            </GoogleButton>
          </form>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} underline="hover" sx={{ fontWeight: 'bold' }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </LeftContainer>

      {/* Right Side: Image Section */}
      <RightContainer>
        <OverlayText>
          LazzyShop
          <Typography variant="body2" component="p" sx={{ mt: 1, color: '#f0f0f0' }}>
            Welcome to Our Store
          </Typography>
        </OverlayText>
      </RightContainer>
    </MainContainer>
  );
};

export default LoginPage;
