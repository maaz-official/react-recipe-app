import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { Button, Typography, Box } from '@mui/material';
import Meta from '../components/Meta'; // Import Meta for SEO

function PaymentPage() {
  // Set Cash On Delivery as the only and default payment method
  const [paymentMethod] = useState('Cash On Delivery');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));  // Automatically saving "Cash On Delivery"
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      {/* Meta Component for SEO */}
      <Meta 
        title="Payment Method - LazzyShop" 
        description="Choose your payment method at LazzyShop. Currently, we only accept Cash on Delivery."
        keywords="payment, cash on delivery, LazzyShop payment"
      />
      
      <CheckoutSteps step1 step2 step3 />
      <Box
        component="form"
        onSubmit={submitHandler}
        sx={{
          mt: 4,
          p: 3,
          borderRadius: '10px',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
          Payment Method
        </Typography>

        {/* Displaying only the Cash On Delivery option */}
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
          <strong>Cash On Delivery</strong> is the only payment method available.
        </Typography>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            mt: 4,
            py: 1.5,
            fontSize: '1.2rem',
            backgroundColor: '#007bff',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
        >
          Continue to Place Order
        </Button>
      </Box>
    </FormContainer>
  );
}

export default PaymentPage;
