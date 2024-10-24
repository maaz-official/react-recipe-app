import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, List, ListItem, Typography, Card, CardMedia, Box } from '@mui/material';
import CheckoutSteps from '../components/CheckoutSteps';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import Meta from '../components/Meta';  // Import Meta for SEO

function PlaceOrderPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        }
    }, [userInfo, navigate]);

    const { shippingAddress, paymentMethod, cartItems } = cart;

    // Calculate prices
    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

    const itemsPrice = addDecimals(cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    useEffect(() => {
        if (!shippingAddress?.address) {
            navigate('/shipping');
        } else if (!paymentMethod) {
            navigate('/payment');
        }
    }, [paymentMethod, shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        try {
            const orderItems = cartItems.map((item) => ({
                name: item.name,
                qty: item.qty,
                image: item.image,
                price: item.price,
                product: item.product || item._id, // Ensure the product ID is present
                color: item.color, // Pass color
                size: item.size,   // Pass size
            }));

            const res = await createOrder({
                orderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            }).unwrap();

            dispatch(clearCartItems());
            navigate(`/order/${res._id}`);
        } catch (err) {
            if (err.status === 401) {
                toast.error('You are not authorized. Please log in again.');
                navigate('/login');
            } else {
                toast.error(err?.data?.message || err.error || 'An error occurred');
            }
        }
    };

    return (
        <>
            <Meta 
                title="Place Order - LazzyShop" 
                description="Review your order details and place your order. Ensure all items, shipping address, and payment method are correct."
                keywords="place order, LazzyShop, checkout"
            />

            <CheckoutSteps step1 step2 step3 step4 />
            <Grid container spacing={2}>
                <Grid item md={8}>
                    <List>
                        <ListItem>
                            <Box width="100%">
                                <Typography variant="h6" component="h2" gutterBottom>
                                    Shipping
                                </Typography>
                                <Typography variant="body1" component="div">
                                    Address: {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}, {shippingAddress.country}
                                </Typography>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box width="100%">
                                <Typography variant="h6" component="h2" gutterBottom>
                                    Payment Method
                                </Typography>
                                <Typography variant="body1" component="div">
                                    Method: {paymentMethod}
                                </Typography>
                            </Box>
                        </ListItem>
                        <ListItem>
                            <Box width="100%">
                                <Typography variant="h6" component="h2" gutterBottom>
                                    Order Items
                                </Typography>
                                {cartItems.length === 0 ? (
                                    <Message variant="info">
                                        <span>Your Cart Is Empty</span>
                                    </Message>
                                ) : (
                                    <List>
                                        {cartItems.map((item, index) => (
                                            <ListItem key={index}>
                                                <Grid container spacing={2} alignItems="center">
                                                    <Grid item md={1}>
                                                        <CardMedia
                                                            component="img"
                                                            image={item.image.startsWith('http') ? item.image : `https://backend-shop-five.vercel.app${item.image}`}
                                                            alt={item.name}
                                                            sx={{ width: '100%', height: 'auto' }}
                                                        />
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Link to={`/products/${item.product}`}>
                                                            {item.name}
                                                        </Link>
                                                        {/* Display selected color and size */}
                                                        {item.color && (
                                                            <Typography variant="body2">
                                                                Color: {item.color}
                                                            </Typography>
                                                        )}
                                                        {item.size && (
                                                            <Typography variant="body2">
                                                                Size: {item.size}
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                    <Grid item md={4}>
                                                        {item.qty} x ${item.price.toFixed(2)} = ${ (item.qty * item.price).toFixed(2) }
                                                    </Grid>
                                                </Grid>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={4}>
                    <Card>
                        <List>
                            <ListItem>
                                <Typography variant="h6" component="h2">Order Summary</Typography>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>Items:</Grid>
                                    <Grid item xs={6}>${itemsPrice}</Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>Shipping:</Grid>
                                    <Grid item xs={6}>${shippingPrice}</Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>Tax:</Grid>
                                    <Grid item xs={6}>${taxPrice}</Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}><strong>Total:</strong></Grid>
                                    <Grid item xs={6}><strong>${totalPrice}</strong></Grid>
                                </Grid>
                            </ListItem>

                            {error && (
                                <ListItem>
                                    <Message severity="error">
                                        <span>{error.data?.message || error.error}</span>
                                    </Message>
                                </ListItem>
                            )}

                            <ListItem>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={cartItems.length === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                            </ListItem>

                            {isLoading && (
                                <ListItem>
                                    <Loader />
                                </ListItem>
                            )}
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

export default PlaceOrderPage;
