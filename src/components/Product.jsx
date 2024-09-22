import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from './Rating';

function Product({ product }) {
  const calculateDiscountPercentage = (oldPrice, newPrice) => {
    return oldPrice && newPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;
  };

  const percentageOff = calculateDiscountPercentage(product.oldPrice, product.price);

  return (
    <Card className="my-3 p-3 rounded position-relative shadow-sm border-0">
      <Link to={`/product/${product._id}`}>
        {/* Main product image */}
        <Card.Img
  src={product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`} 
  variant="top"
          className="img-fluid product-image"
          style={{
            objectFit: 'cover',
            borderRadius: '10px',
            width: '100%',  // Ensures it fills its container
            height: 'auto', // Allows the height to adjust based on aspect ratio
            maxHeight: '400px', // Set a max height for larger screens
          }}
        />
      </Link>

      {/* Discount percentage badge in top-left corner */}
      {percentageOff > 0 && (
        <div
          className="position-absolute top-0 start-0 bg-danger text-white px-3 py-1 rounded shadow-lg"
          style={{
            zIndex: 1,
            transform: 'translate(15px, 15px)',
            background: 'linear-gradient(45deg, #ff416c, #ff4b2b)', // Gradient background
            fontSize: '9px', // Slightly larger font size
            fontWeight: 'bold', // Bold font for emphasis
            borderRadius: '12px', // More rounded corners
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)', // Box shadow for depth
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)', // Slight text shadow for better readability
          }}
        >
          {percentageOff}% OFF
        </div>
      )}

      <Card.Body>
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as="div" className="overflow-hidden text-ellipsis whitespace-nowrap">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        {/* Rating and Reviews */}
        <div className="my-2">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </div>

        {/* Display product price with old price in a responsive flexbox */}
        <div className="d-flex flex-row align-items-center mt-3">
          <Card.Text
            as="h3"
            className="mb-1 mb-sm-0 text-success fw-bold"
            style={{ fontSize: '16px' }}
          >
            Rs. {product.price}
          </Card.Text>
          {product.oldPrice && (
            <Card.Text
              className="text-muted text-decoration-line-through ms-3 mb-0"
              style={{ fontSize: '16px' }}
            >
              Rs. {product.oldPrice}
            </Card.Text>
          )}
        </div>

        {/* Responsive styles for small devices */}
        <style>
          {`
            @media (max-width: 375px) {
              .d-flex.flex-row .fw-bold, .text-muted {
                font-size: 12px !important;
              }

              .product-image {
                height: 100px !important;  /* Adjust the height for smaller screens */
              }
            }

            @media (max-width: 480px) {
              .d-flex.flex-row .fw-bold, .text-muted {
                font-size: 10px !important;
              }

              .product-image {
                height: 160px !important;  /* Slightly larger for medium mobile screens */
              }
            }

            @media (min-width: 768px) {
              .d-flex.flex-row .fw-bold, .text-muted {
                font-size: 18px !important;
              }

              .product-image {
                height: 260px !important;  /* Larger height for tablets and larger screens */
              }
            }
            }
          `}
        </style>
      </Card.Body>
    </Card>
  );
}

export default Product;
