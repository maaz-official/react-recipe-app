import { PRODUCT_URL, UPLOAD_URL } from '../constant';
import { apiSlice, } from './apiSlices';

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all products with pagination
    getProducts: builder.query({
      query: ({ pageNumber, keyword }) => ({
        url: PRODUCT_URL,
        params: { pageNumber, keyword }, // Pass the pageNumber as a query param to the backend
      }),
      keepUnusedDataFor: 5, // Keeps the data cached for 5 seconds after not being used
      providesTags: (result) =>
        result
          ? [
            ...result.products.map(({ _id }) => ({ type: 'Product', id: _id })), // Cache each product by its ID
            { type: 'Product', id: 'LIST' }, // Cache the product list
          ]
          : [{ type: 'Product', id: 'LIST' }], // Cache only the product list if no result
    }),

    // Fetch a product by ID
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5, // Cache duration for individual product
      providesTags: (result, error, productId) => [{ type: 'Product', id: productId }], // Cache product by its ID
    }),

    // Create a new product
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCT_URL,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }], // Invalidate product list cache after creation
    }),

    // Update a product by ID
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data._id}`, // Pass the product ID in the URL
        method: 'PUT',
        body: data, // Send the updated product data in the request body
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: 'Product', id: _id }, // Invalidate cache for the updated product
        { type: 'Product', id: 'LIST' }, // Invalidate cache for the product list
      ],
    }),

    // Upload a product image
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`, // Image upload endpoint
        method: 'POST',
        body: data, // The image file (FormData)
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: 'DELETE',
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Product']
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),    
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productApiSlice;
