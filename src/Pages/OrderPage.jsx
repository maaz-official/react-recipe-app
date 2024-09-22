import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Button,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
  usePaidOrderMutation,
} from '../slices/orderApiSlice';
import { useSelector } from 'react-redux';

function OrderPage() {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [deliverOrder, { isLoading: loadingDelivered }] = useDeliverOrderMutation();
  const [paidOrder, { isLoading: loadingPaid }] = usePaidOrderMutation();  // Loading state for paying
  const [loading, setLoading] = useState(false);

  // Local state to manage the payment status and paidAt date
  const [isPaid, setIsPaid] = useState(false);
  const [paidAt, setPaidAt] = useState(null);  // To manage the dynamic paid date

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || 'Error fetching order details');
    }
    // Initialize the local state with the values from the order
    if (order) {
      setIsPaid(order.isPaid);
      setPaidAt(order.paidAt);  // Set the initial paidAt value if available
    }
  }, [error, order]);

  if (!order) {
    return <Loader />;
  }

  // Calculate total items price
  const itemsPrice = order.orderItems
    ? order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    : 0;

  // Handle marking order as delivered (Admin only)
  const deliverHandler = async () => {
    setLoading(true);
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to deliver order');
    } finally {
      setLoading(false);
    }
  };

  // Handle marking the order as paid for Cash on Delivery (Admin only)
  const handleCashOnDelivery = async () => {
    setLoading(true);
    try {
      await paidOrder(orderId);
      setIsPaid(true);  // Update the local state to mark the order as paid
      setPaidAt(new Date());  // Dynamically set the current date for paidAt
      refetch();  // Fetch the updated order details after marking as paid
      toast.success('Order marked as paid (Cash on Delivery)');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to mark as paid');
    } finally {
      setLoading(false);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <div>{toast.error(error?.data?.message || 'An error occurred')}</div>
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        p: 3,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      {/* Order Details Section */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Order Summary: <span style={{ color: '#1976d2' }}>#{orderId}</span>
        </Typography>

        {/* Shipping Info */}
        <Card
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#fff',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <Typography variant="h5" gutterBottom>
            Shipping Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography>
            <strong>Name:</strong> {order.user.name}
          </Typography>
          <Typography>
            <strong>Email:</strong>{' '}
            <a href={`mailto:${order.user.email}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
              {order.user.email}
            </a>
          </Typography>
          <Typography>
            <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </Typography>
          {order.isDelivered ? (
            <Typography sx={{ color: 'green', mt: 2 }}>
              Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
            </Typography>
          ) : (
            <Typography sx={{ color: 'red', mt: 2 }}>
              Not Delivered
            </Typography>
          )}
          {/* Deliver Button (Admin Only) */}
          {userInfo && userInfo.isAdmin && !order.isDelivered && (
            <Button
              variant="contained"
              color="primary"
              onClick={deliverHandler}
              disabled={loading || loadingDelivered}
              sx={{ mt: 3 }}
            >
              {loadingDelivered ? 'Marking as Delivered...' : 'Mark as Delivered'}
            </Button>
          )}
        </Card>

        {/* Payment Info */}
        <Card
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#fff',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <Typography variant="h5" gutterBottom>
            Payment Details
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography>
            <strong>Payment Method:</strong> {order.paymentMethod}
          </Typography>
          {isPaid ? (
            <Typography sx={{ color: 'green', mt: 2 }}>
              Paid on {new Date(paidAt).toLocaleDateString()} (Cash on Delivery)
            </Typography>
          ) : (
            <Typography sx={{ color: 'red', mt: 2 }}>
              Not Paid
            </Typography>
          )}
          {/* Mark as Paid Button for Cash on Delivery (Admin Only) */}
          {!isPaid && order.paymentMethod === 'Cash On Delivery' && (
            <Button
              variant="contained"
              color="success"
              onClick={handleCashOnDelivery}
              disabled={loading || loadingPaid}
              sx={{ mt: 3 }}
            >
              {loadingPaid ? 'Marking as Paid...' : 'Mark as Paid (Cash on Delivery)'}
            </Button>
          )}
        </Card>

        {/* Order Items */}
        <Card
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#fff',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <Typography variant="h5" gutterBottom>
            Order Items
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {order.orderItems.length === 0 ? (
            <Typography color="textSecondary">Your order is empty</Typography>
          ) : (
            <ListItems orderItems={order.orderItems} />
          )}
        </Card>
      </Box>

      {/* Order Summary Section */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 12,
          p: 3,
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        <Typography variant="h5" gutterBottom>
          Order Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {/* Using the calculated itemsPrice */}
        <SummaryRow label="Items" value={`$${itemsPrice}`} />
        <SummaryRow label="Shipping" value={`$${order.shippingPrice}`} />
        <SummaryRow label="Tax" value={`$${order.taxPrice}`} />
        <SummaryRow label="Total" value={`$${order.totalPrice}`} />
      </Box>
    </Box>
  );
}

// Helper component to display order items with color and size
const ListItems = ({ orderItems }) => (
  <Box>
    {orderItems.map((item, index) => (
      <Grid container key={index} spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Grid item xs={3} sm={2}>
          <CardMedia
            component="img"
            image={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
            alt={item.name}
            sx={{ borderRadius: '8px', width: '100%', boxShadow: 2 }}
          />
        </Grid>
        <Grid item xs={6} sm={6}>
          <Typography>
            <a href={`/product/${item.product}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              {item.name}
            </a>
          </Typography>
          {/* Display selected color and size */}
          <Box sx={{ mt: 1 }}>
            {item.color && (
              <Typography variant="body2" color="textSecondary">
                <strong>Color:</strong> {item.color}
              </Typography>
            )}
            {item.size && (
              <Typography variant="body2" color="textSecondary">
                <strong>Size:</strong> {item.size}
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={3} sm={4}>
          <Typography>
            {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    ))}
  </Box>
);

// Helper component for order summary rows
const SummaryRow = ({ label, value }) => (
  <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
    <Typography variant="body1" fontWeight="bold">
      {label}:
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Grid>
);

export default OrderPage;
