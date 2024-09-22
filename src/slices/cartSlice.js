import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

// Initial state that checks if the cart exists in localStorage or sets defaults
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { 
      cartItems: [], 
      shippingAddress: {}, 
      paymentMethod: 'Cash On Delivery',
      itemsPrice: 0,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: 0,
    };

// Create the cart slice with reducers to handle actions
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // NOTE: we don't need user, rating, numReviews or reviews
      // in the cart
      const { user, rating, numReviews, reviews, ...item } = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state, item);
    },

    

    removeFromCart: (state, action) => {
      // Filter out the item being removed from the cart
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      // Update the cart state and recalculate prices
      updateCart(state); // Recalculate prices and update cart
    },

    saveShippingAddress: (state, action) => {
      // Update the shipping address in the state
      state.shippingAddress = action.payload;

      // Update the cart state (with the new shipping address) and save to localStorage
      updateCart(state); // Save shipping address and update cart
    },

    savePaymentMethod: (state, action) => {
      // Update the payment method in the state
      state.paymentMethod = action.payload;

      // Update the cart state (with the new payment method) and save to localStorage
      updateCart(state); // Save payment method and update cart
    },

    clearCartItems: (state) => {
      // Clear all cart items
      state.cartItems = [];

      // Update the cart state and clear from localStorage
      updateCart(state); // Clear cart and update localStorage
    },

    resetCart: (state) => {
      // Reset the cart state to its initial values when a user logs out
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = 'EasyPaisa';
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;

      // Remove the cart from localStorage when logging out
      localStorage.removeItem('cart');
    },
  },
});

// Export the cart actions and reducer
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
