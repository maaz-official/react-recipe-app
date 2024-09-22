import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import FormContainer from '../components/FormContainer'; // Ensure you have this component
import { Button, TextField, Typography, Box } from '@mui/material';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta'; // Import the Meta component for SEO

function ShippingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Set initial form state based on stored shipping address or default to empty strings
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <>
      {/* Meta Component for SEO */}
      <Meta
        title="Shipping - LazzyShop"
        description="Enter your shipping address for quick and safe delivery of your LazzyShop orders."
        keywords="shipping, address, LazzyShop, delivery"
      />

      <FormContainer>
        <CheckoutSteps step1 step2 />

        <Typography
          variant="h4"
          component="h1"
          sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}
        >
          Shipping Address
        </Typography>

        <form onSubmit={submitHandler}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Address"
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Postal Code"
              variant="outlined"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Country"
              variant="outlined"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 1,
              mb: 3,
              py: 1.5,
              fontSize: '1.2rem',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#115293',
              },
              borderRadius: '10px',
            }}
          >
            Continue to Payment
          </Button>
        </form>
      </FormContainer>
    </>
  );
}

export default ShippingPage;
