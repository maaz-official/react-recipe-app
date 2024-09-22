import { apiSlice } from './apiSlices';
import { ORDER_URL } from '../constant';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Mutation to create a new order
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDER_URL,
        method: 'POST',
        body: order,
      }),
    }),

    // Query to get order details by order ID
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // // Mutation to mark the order as paid (for Cash on Delivery or online payment)
    // payOrder: builder.mutation({
    //   query: (orderId, details) => ({
    //     url: `${ORDER_URL}/${orderId}/pay`,
    //     method: 'PUT',
    //     body: { ...details },
    //   }),
    // }),

    // Mutation to mark the order as delivered
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),

    // Mutation to mark the order as delivered
    paidOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDER_URL}/${orderId}/pay`,
        method: 'PUT',
      }),
    }),

    // Query to get all orders for a logged-in user
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDER_URL}/orders`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: `${ORDER_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePaidOrderMutation,
  useDeliverOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
} = orderApiSlice;
