import React from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import { Link, useNavigate } from 'react-router-dom'; // To allow navigation back
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from '../slices/cartSlice'; // Import actions
import Message from '../components/Message'; // Import the Message component

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch the cart state from Redux
  const cart = useSelector((state) => state.cart);
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = cart;

  // Ensure prices are numbers or use a fallback of 0
  const formattedItemsPrice = Number(itemsPrice || 0).toFixed(2);
  const formattedShippingPrice = Number(shippingPrice || 0).toFixed(2);
  const formattedTaxPrice = Number(taxPrice || 0).toFixed(2);
  const formattedTotalPrice = Number(totalPrice || 0).toFixed(2);

  // Increment item quantity, but do not exceed countInStock
  const incQty = (item) => {
    if (item.qty < item.countInStock) {
      dispatch(
        addToCart({
          ...item,
          qty: item.qty + 1,
        })
      );
    }
  };

  // Decrement item quantity, but do not go below 1
  const decQty = (item) => {
    if (item.qty > 1) {
      dispatch(
        addToCart({
          ...item,
          qty: item.qty - 1,
        })
      );
    }
  };

  // Checkout handler to navigate to the login or shipping page
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  // Remove item from cart
  const removeItemHandler = (itemId) => {
    dispatch(removeFromCart(itemId)); // Call removeFromCart with the item's ID
  };

  return (
    <Box sx={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      {/* Main Container */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Column layout on small screens, row on medium+
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/* Product Section */}
        {cartItems.length === 0 ? (
          // Use the Message component to display "Your cart is empty" message
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Message variant="info">
              Your cart is empty <Link to="/" style={{ textDecoration: 'underline' }}>Go Back</Link>
            </Message>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: { xs: "100%", md: "65%" }, // Full width on mobile, 65% on medium+
              borderBottom: "1px solid #e0e0e0",
              padding: "20px",
            }}
          >
            {/* Map over cart items to display them */}
            {cartItems.map((item) => (
              <Box key={item._id} sx={{ display: "flex", alignItems: "center", flex: 1, marginBottom: "20px" }}>
                {/* Product Image and Details */}
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <img
                    src={`https://backend-shop-five.vercel.app${item.image}`} // Ensure proper image URL path
                    alt={item.name}
                    width="120px"
                    style={{ borderRadius: "8px" }}
                  />
                  <Box sx={{ marginLeft: "20px" }}>
                    <Typography variant="h6" component="div" sx={{ fontSize: { xs: "16px", sm: "18px" } }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" component="div" color="textSecondary" sx={{ fontSize: { xs: "12px", sm: "14px" } }}>
                      {item.category}
                    </Typography>

                    {/* Display color and size if available */}
                    {item.color && (
                      <Typography variant="body2" component="div" sx={{ color: "textSecondary", marginTop: "5px" }}>
                        Color: {item.color}
                      </Typography>
                    )}
                    {item.size && (
                      <Typography variant="body2" component="div" sx={{ color: "textSecondary", marginTop: "5px" }}>
                        Size: {item.size}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Product Quantity and Price */}
                <Box sx={{ display: "flex", alignItems: "center", marginTop: { xs: "10px", sm: "0" } }}>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: "40px" }}
                    onClick={() => decQty(item)}
                  >
                    -
                  </Button>
                  <Typography sx={{ marginX: "10px" }}>{item.qty}</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: "40px" }}
                    onClick={() => incQty(item)}
                    disabled={item.qty >= item.countInStock} // Disable button if qty is at max stock
                  >
                    +
                  </Button>
                  <Typography
                    sx={{ marginLeft: "30px", fontWeight: "bold", fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    ₹ {(item.price * item.qty).toFixed(2)} {/* Ensures that the number has two decimal places */}
                  </Typography>
                </Box>

                {/* Cross Icon for Remove */}
                <IconButton
                  sx={{ marginLeft: { xs: "auto", sm: "20px" }, marginTop: { xs: "10px", sm: "0" } }}
                  onClick={() => removeItemHandler(item._id)} // Pass the item's _id to remove it
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* Order Summary Section */}
        {cartItems.length > 0 && (
          <Box
            sx={{
              width: { xs: "100%", md: "30%" }, // Full width on mobile, 30% on medium+
              padding: "20px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              marginTop: { xs: "20px", md: "0" }, // Add margin on mobile devices
              marginLeft: { md: "20px" }, // Only add left margin on medium+
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              component="div" // Change component to avoid nested <p> tags
              sx={{ fontWeight: "bold", marginBottom: "20px", fontSize: { xs: "18px", sm: "20px" } }}
            >
              Order Summary
            </Typography>

            {/* Items Price */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: { xs: "14px", sm: "16px" }
              }}
            >
              <Typography component="div">Items Price</Typography>
              <Typography component="div">₹ {formattedItemsPrice}</Typography> {/* Ensure 2 decimal places */}
            </Box>

            {/* Shipping Price */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                fontSize: { xs: "14px", sm: "16px" }
              }}
            >
              <Typography component="div">Shipping Price</Typography>
              <Typography component="div">₹ {formattedShippingPrice}</Typography> {/* Ensure 2 decimal places */}
            </Box>

            {/* Tax Price */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "green",
                fontSize: { xs: "14px", sm: "16px" }
              }}
            >
              <Typography component="div">Tax Price</Typography>
              <Typography component="div">₹ {formattedTaxPrice}</Typography> {/* Ensure 2 decimal places */}
            </Box>

            {/* Total Price */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                fontWeight: "bold",
                fontSize: { xs: "14px", sm: "16px" }
              }}
            >
              <Typography component="div">Total Price</Typography>
              <Typography component="div">₹ {formattedTotalPrice}</Typography> {/* Ensure 2 decimal places */}
            </Box>

            {/* Place Order Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "10px",
                fontWeight: "bold",
                fontSize: { xs: "14px", sm: "16px" }
              }}
              fullWidth
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              CHECKOUT HERE
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Cart;
