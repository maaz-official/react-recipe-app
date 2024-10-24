import React from "react";
import { Box, Typography } from "@mui/material";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { Link } from "react-router-dom";
import Carousel from "react-material-ui-carousel"; // You can use any carousel, including MUI-compatible ones
import Loader from "./Loader";
import Message from "./Message";

function ProductCarousel() {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel
      autoPlay
      animation="slide"
      duration={500}
      indicators={false}
      navButtonsAlwaysVisible
      sx={{ maxWidth: "900px", mx: "auto", mt: 4 }} // Center the carousel with a full width
    >
      {products.map((product) => (
        <Box
          key={product._id}
          sx={{
            position: "relative",
            textAlign: "center",
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            overflow: "hidden",
            height: { xs: "300px", md: "400px" }, // Carousel height stays the same
          }}
        >
          <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
            <Box
              component="img"
              src={product.image.startsWith('http') ? product.image : `https://backend-shop-five.vercel.app${product.image}`} 
              alt={product.name}
              sx={{
                maxHeight: "80%", // Limit the image size to 80% of the carousel height
                width: "auto", // Maintain aspect ratio, let width adjust accordingly
                objectFit: "contain", // Ensure the image scales well without cutting
                borderRadius: 2,
                display: 'block',
                margin: '0 auto', // Center the image horizontally
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "rgba(0, 0, 0, 0.6)",
                color: "white",
                py: 1.5, // Reduce padding to make caption smaller
              }}
            >
              <Typography variant="h6" component="div" sx={{ mb: 0.5 }}>
                {product.name}
              </Typography>
              <Typography variant="body1">${product.price}</Typography>
            </Box>
          </Link>
        </Box>
      ))}
    </Carousel>
  );
}

export default ProductCarousel;
