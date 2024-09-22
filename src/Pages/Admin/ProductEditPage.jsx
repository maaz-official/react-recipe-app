import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import ConfirmDialog from '../../components/ConfirmDialog'; // Import the ConfirmDialog component
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams(); // Get product ID from URL params

  // State variables for product fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [oldPrice, setOldPrice] = useState(0); // Add oldPrice
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]); // Add images for multiple images support
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState([]); // Add color array
  const [sizes, setSizes] = useState([]); // Add sizes array
  const [uploading, setUploading] = useState(false);

  // State for the confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation(); // Assuming this mutation is available
  const [uploadProductImage] = useUploadProductImageMutation();
  const navigate = useNavigate();

  // Set product data when fetched
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setOldPrice(product.oldPrice); // Set oldPrice
      setImage(product.image);
      setImages(product.images || []); // Set multiple images
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setColors(product.color || []); // Set color array
      setSizes(product.sizes || []); // Set sizes array
    }
  }, [product]);

  // Real-time updates for oldPrice
  useEffect(() => {
    if (oldPrice !== product?.oldPrice) {
      toast.info('Old price updated in real-time');
    }
  }, [oldPrice, product?.oldPrice]); // Add product?.oldPrice to the dependency array

  // Real-time updates for colors
  useEffect(() => {
    if (colors.length !== product?.color?.length) {
      toast.info('Colors updated in real-time');
    }
  }, [colors, product?.color?.length]); // Add product?.color?.length to the dependency array

  // Real-time updates for sizes
  useEffect(() => {
    if (sizes.length !== product?.sizes?.length) {
      toast.info('Sizes updated in real-time');
    }
  }, [sizes, product?.sizes?.length]); // Add product?.sizes?.length to the dependency array

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        _id: productId,
        name,
        price,
        oldPrice, // Include oldPrice
        image,
        images, // Include multiple images
        brand,
        category,
        description,
        countInStock,
        color: colors, // Include colors
        sizes, // Include sizes
      }).unwrap();
      toast.success('Product updated');
      refetch();
      navigate('/admin/productslist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Handle file upload
  const uploadFileHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      setUploading(true);
      try {
        const res = await uploadProductImage(formData).unwrap();
        setImage(res.image);
        toast.success('Image uploaded successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      } finally {
        setUploading(false);
      }
    }
  };

  // Show confirmation dialog before deleting
  const handleDeleteClick = () => {
    setShowConfirmDialog(true); // Open the confirmation dialog
  };

  // Delete the product after confirmation
  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(productId).unwrap(); // Perform delete action
      toast.success('Product deleted');
      setShowConfirmDialog(false); // Close the dialog
      navigate('/admin/productlist'); // Redirect to product list
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Add multiple colors
  const addColor = () => {
    const newColor = prompt('Enter a new color:');
    if (newColor) setColors([...colors, newColor]);
  };

  // Remove color
  const removeColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove));
  };

  // Add multiple sizes
  const addSize = () => {
    const newSize = prompt('Enter a new size:');
    if (newSize) setSizes([...sizes, newSize]);
  };

  // Remove size
  const removeSize = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove));
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            {/* Name */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Price */}
            <Form.Group controlId="price" className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </Form.Group>

            {/* Old Price */}
            <Form.Group controlId="oldPrice" className="mb-3">
              <Form.Label>Old Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter old price"
                value={oldPrice}
                onChange={(e) => setOldPrice(Number(e.target.value))}
              />
            </Form.Group>

            {/* Image */}
            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
              <Form.Control
                type="file"
                onChange={uploadFileHandler}
                className="mt-2"
              />
              {uploading && <Loader />}
            </Form.Group>

            {/* Multiple Images */}
            <Form.Group controlId="images" className="mb-3">
              <Form.Label>Additional Images</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter additional image URLs, separated by commas"
                value={images.join(', ')}
                onChange={(e) => setImages(e.target.value.split(', '))}
              />
            </Form.Group>

            {/* Colors */}
            <Form.Group controlId="colors" className="mb-3">
              <Form.Label>Colors</Form.Label>
              <div>
                {colors.map((color, idx) => (
                  <Button key={idx} variant="outline-secondary" onClick={() => removeColor(color)} className="me-2 mb-2">
                    {color} &times;
                  </Button>
                ))}
                <Button variant="primary" onClick={addColor}>
                  Add Color
                </Button>
              </div>
            </Form.Group>

            {/* Sizes */}
            <Form.Group controlId="sizes" className="mb-3">
              <Form.Label>Sizes</Form.Label>
              <div>
                {sizes.map((size, idx) => (
                  <Button key={idx} variant="outline-secondary" onClick={() => removeSize(size)} className="me-2 mb-2">
                    {size} &times;
                  </Button>
                ))}
                <Button variant="primary" onClick={addSize}>
                  Add Size
                </Button>
              </div>
            </Form.Group>

            {/* Brand */}
            <Form.Group controlId="brand" className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </Form.Group>

            {/* Category */}
            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </Form.Group>

            {/* Count In Stock */}
            <Form.Group controlId="countInStock" className="mb-3">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock quantity"
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
                required
              />
            </Form.Group>

            {/* Description */}
            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter product description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Update Product
            </Button>

            {/* Delete Button */}
            <Button variant="danger" className="mt-3" onClick={handleDeleteClick}>
              Delete Product
            </Button>
          </Form>
        )}
      </FormContainer>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        show={showConfirmDialog}
        onHide={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </>
  );
};

export default ProductEditScreen;
