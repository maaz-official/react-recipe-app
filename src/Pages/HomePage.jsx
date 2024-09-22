import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import ProductCarousel from '../components/ProductCarousel'; // Import ProductCarousel component
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate'; // Import the Paginate component
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material'; // Import Material UI components for styling
import Meta from '../components/Meta'; // Import Meta for SEO

const HomePage = () => {
  // Get pageNumber and keyword from URL params
  const { pageNumber = 1, keyword } = useParams(); // Default pageNumber to 1 if not provided

  // Fetch products data with pageNumber
  const { data, isLoading, isError, error } = useGetProductsQuery({ keyword, pageNumber });

  return (
    <Box sx={{ mt: 4, mb: 6, px: 2 }}>
      {/* Meta Component for SEO */}
      <Meta 
        title={keyword ? `Search Results for "${keyword}"` : 'Welcome to LazzyShop'}
        description={keyword ? `Find the best products matching "${keyword}"` : 'Browse the latest products on LazzyShop'}
        keywords={keyword ? `search, ${keyword}, products` : 'latest products, shopping, buy now'}
      />

      {/* Product Carousel */}
      {!keyword && <ProductCarousel />} {/* Only show carousel when not searching */}

      {/* Page Title */}
      <Typography
        variant="h4"
        component="h1"
        sx={{
          textAlign: 'center',
          mt: 4,
          mb: 4,
          fontWeight: 'bold',
          fontSize: { xs: '1.5rem', md: '2.5rem' }, // Responsive font size
        }}
      >
        {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
      </Typography>

      {/* Handling the loading state */}
      {isLoading && <Loader />}

      {/* Handling the error state */}
      {isError && (
        <Message variant="danger">
          <span>Error: {error?.data?.message || error.error}</span>
        </Message>
      )}

      {/* Render products when available */}
      <Row className="gy-4"> {/* Adds spacing between rows */}
        {data?.products && data.products.length === 0 ? (
          <Message>
            <span>No products available</span>
          </Message>
        ) : (
          data?.products &&
          data.products.map((product) => (
            <Col key={product._id} xs={6} sm={6} md={4} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))
        )}
      </Row>

      {/* Pagination Component */}
      {data?.pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
