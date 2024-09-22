import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { addToCart } from '../slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Meta from '../components/Meta'; // Import the Meta component

function ProductPage() {
  const { id: productId } = useParams();
  const { data: product, isLoading, refetch, isError, error } = useGetProductDetailsQuery(productId);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [itemQuantity, setItemQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.color && product.color.length > 0 ? product.color[0] : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setSelectedImage(product.image); // Default to the main image
    }
  }, [product]);

  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    dispatch(
      addToCart({
        ...product,
        qty: itemQuantity,
        color: selectedColor,
        size: selectedSize,
      })
    );
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      toast.error('Please fill out the rating and comment');
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();

      toast.success('Review submitted successfully');
      refetch();
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit the review');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Message variant="danger">Error: {error?.data?.message || 'Error fetching product details'}</Message>;
  }

  const incNum = () => {
    if (itemQuantity < product.countInStock) {
      setItemQuantity(itemQuantity + 1);
    }
  };

  const decNum = () => {
    if (itemQuantity > 1) {
      setItemQuantity(itemQuantity - 1);
    }
  };

  const calculateDiscountPercentage = (oldPrice, newPrice) => {
    return oldPrice && newPrice ? Math.round(((oldPrice - newPrice) / oldPrice) * 100) : 0;
  };

  const percentageOff = calculateDiscountPercentage(product.oldPrice, product.price);

  return (
    <div className="min-h-screen bg-white py-10">
      {/* Meta Component for SEO */}
      <Meta title={product.name} description={product.description} keywords={`${product.name}, ${product.category}, buy ${product.name}, ${product.brand}`} />

      <Link to="/" className="ml-5 text-orange-600 font-semibold">&lt; Go Back</Link>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start mt-10 bg-white p-6 rounded-lg space-y-6 md:space-y-0 md:space-x-6">
        {/* Left - Product Images */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative">
            <img src={selectedImage.startsWith('http') ? selectedImage : `http://localhost:5000${selectedImage}`} alt={product.name} className="w-full rounded-lg cursor-pointer" />
            {percentageOff > 0 && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-sm">
                {percentageOff}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails for multiple images */}
          {product.images && product.images.length > 0 && (
            <div className="flex space-x-2 mt-4">
              {[product.image, ...product.images].map((img, idx) => (
                <img
                  key={idx}
                  src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                  alt={`Thumbnail ${idx}`}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer ${selectedImage === img ? 'border-4 border-orange-500' : 'border-2 border-gray-300'}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right - Product Details */}
        <div className="w-full md:w-1/2">
          <p className="text-orange-500 uppercase text-sm tracking-wide">{product.brand}</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>

          <p className="mt-4 text-gray-700 text-lg">{product.description}</p>

          <div className="flex items-center space-x-4 mt-4">
            <p className="text-2xl md:text-3xl font-bold text-gray-900">${product.price}</p>
            {product.oldPrice && (
              <>
                <p className="text-gray-500 line-through">${product.oldPrice}</p>
                <div className="bg-orange-100 text-orange-500 px-2 py-1 rounded-full text-sm">{percentageOff}%</div>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <p className="font-semibold">Available Colors:</p>
            <div className="flex space-x-2">
              {product.color &&
                product.color.map((color, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 rounded-full border-4 cursor-pointer transition-all duration-300 ${selectedColor === color ? 'border-orange-500 shadow-lg scale-110' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2 mt-4">
            <p className="font-semibold">Available Sizes:</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2 mt-2">
              {product.sizes &&
                product.sizes.map((size, index) => (
                  <button
                    key={index}
                    className={`border w-full h-12 text-center flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 ${selectedSize === size ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center space-x-4 mt-4">
              <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
            </div>
            <p className="mt-2 text-gray-600 text-md">Category: {product.category}</p>
            <p className="mt-2 text-gray-700 text-md">
              {product.countInStock > 0 ? (
                <span className="font-semibold text-green-600">In Stock</span>
              ) : (
                <span className="font-semibold text-red-600">Out of Stock</span>
              )}
              {product.countInStock > 0 && <span className=" mt-1 text-sm text-gray-500">: {product.countInStock}</span>}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button className="px-4 py-2 text-gray-600" onClick={decNum}>-</button>
              <span className="px-4 py-2 text-lg">{itemQuantity}</span>
              <button className="px-4 py-2 text-gray-600" onClick={incNum}>+</button>
            </div>
            <button
              className="bg-orange-600 text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg w-full sm:w-auto hover:bg-orange-700 transition-all duration-300 flex items-center justify-center"
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              <i className="fas fa-shopping-cart mr-2"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {product.reviews.length === 0 ? (
          <Message variant="info">No reviews yet</Message>
        ) : (
          product.reviews.map((review) => (
            <div key={review._id} className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <strong>{review.name}</strong>
                <span className="text-sm text-gray-500">{review.createdAt.substring(0, 10)}</span>
              </div>
              <Rating value={review.rating} />
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))
        )}

        <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
          {userInfo ? (
            <form onSubmit={submitReviewHandler}>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="flex items-center space-x-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" className={`text-2xl ${star <= rating ? 'text-orange-500' : 'text-gray-400'}`} onClick={() => setRating(star)}>
                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm p-3"
                  placeholder="Write your review here..."
                  style={{ resize: 'none' }}
                />
              </div>

              <div>
                <button type="submit" className="w-full bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-all duration-300" disabled={loadingProductReview}>
                  {loadingProductReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          ) : (
            <Message variant="info">Please <Link to="/login">login</Link> to write a review</Message>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
