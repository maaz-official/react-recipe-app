import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import GoogleIcon from '@mui/icons-material/Google';
import Loader from '../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useRegisterMutation } from '../slices/userApiSlice';
import { setCredential } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Meta from '../components/Meta'; // Import Meta component for SEO

// Styled components
const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: '20px',
  },
  [theme.breakpoints.up('lg')]: {
    minHeight: '80vh',
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
  [theme.breakpoints.up('lg')]: {
    padding: '50px 80px',
  },
  [theme.breakpoints.up('xl')]: {
    padding: '50px 100px',
  },
}));

const RightContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundImage: 'url("/assets/register.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  borderRadius: '0px 10px 0px 10px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
  [theme.breakpoints.up('lg')]: {
    minHeight: '80vh',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
  },
  [theme.breakpoints.up('lg')]: {
    marginBottom: '25px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: '12px 0',
  borderRadius: '30px',
  marginTop: '20px',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#333',
  },
  '&:disabled': {
    backgroundColor: '#ccc',
  },
  [theme.breakpoints.up('lg')]: {
    padding: '14px 0',
    fontSize: '1.1rem',
    marginTop: '25px',
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
  [theme.breakpoints.up('lg')]: {
    padding: '14px 0',
    marginTop: '25px',
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
  [theme.breakpoints.up('lg')]: {
    fontSize: '2rem',
    bottom: '70px',
    left: '40px',
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '2.5rem',
    bottom: '90px',
    left: '60px',
  },
}));

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // For confirming password
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState('');

  const [register, { isLoading }] = useRegisterMutation();
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
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill out all fields.');
      return false;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return false;
    }

    if (!termsAccepted) {
      setFormError('You must accept the terms and conditions.');
      return false;
    }

    return true;
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) {
      return;
    }

    try {
      const userData = { name, email, password };
      const res = await register(userData).unwrap();
      dispatch(setCredential(res));
      navigate(redirect);
      toast.success('Registration successful!');
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error(
        err?.data?.message || err?.message || 'Registration failed'
      );
    }
  };

  return (
    <MainContainer>
      {/* Meta Component for SEO */}
      <Meta
        title="Register - LazzyShop"
        description="Create a LazzyShop account to enjoy exclusive offers and benefits."
        keywords="register, signup, create account, LazzyShop"
      />

      {/* Left Side: Registration Form */}
      <LeftContainer>
        <Box width="100%" maxWidth={{ xs: '400px', md: '500px', lg: '600px' }}>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              fontSize: { xs: '1.8rem', md: '2rem', lg: '2.2rem' },
            }}
          >
            Create an account
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 4,
              fontSize: { xs: '0.9rem', md: '1rem', lg: '1.1rem' },
            }}
          >
            Join us and enjoy the benefits
          </Typography>

          {isLoading && <Loader />}
          {formError && <Typography color="error">{formError}</Typography>}

          <form onSubmit={submitHandler}>
            <StyledTextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                style: {
                  fontSize: '1rem',
                },
              }}
            />
            <StyledTextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                style: {
                  fontSize: '1rem',
                },
              }}
            />
            <StyledTextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                style: {
                  fontSize: '1rem',
                },
              }}
            />
            <StyledTextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                style: {
                  fontSize: '1rem',
                },
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  color="default"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
              }
              label="I accept the terms and conditions"
              sx={{
                '& .MuiTypography-root': {
                  fontSize: { xs: '0.9rem', md: '1rem' },
                },
              }}
            />

            <StyledButton
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
            >
              {isLoading ? <Loader size={20} /> : 'Sign Up'}
            </StyledButton>

            <GoogleButton fullWidth>
              <GoogleIcon sx={{ mr: 1 }} /> Sign Up with Google
            </GoogleButton>
          </form>

          <Typography
            variant="body2"
            sx={{
              mt: 3,
              textAlign: 'center',
              fontSize: { xs: '0.9rem', md: '1rem' },
            }}
          >
            Already have an account?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              underline="hover"
              style={{ fontWeight: 'bold' }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </LeftContainer>

      {/* Right Side: Image Section */}
      <RightContainer>
        <OverlayText>
          Welcome to LazzyShop
          <Typography
            variant="body2"
            component="p"
            sx={{
              mt: 1,
              color: '#f0f0f0',
              fontSize: { xs: '0.9rem', md: '1rem', lg: '1.2rem' },
            }}
          >
            Discover amazing products
          </Typography>
        </OverlayText>
      </RightContainer>
    </MainContainer>
  );
};

export default RegisterPage;
