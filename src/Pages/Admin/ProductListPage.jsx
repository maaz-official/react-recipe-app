import { FaEdit, FaTrash } from "react-icons/fa";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Paginate from "../../components/Paginate"; // Import Paginate component
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify"; // Optional for user feedback

function ProductListPage() {
  const navigate = useNavigate();
  
  // Get the current page from the URL params, default to 1 if not provided
  const { pageNumber = 1 } = useParams();

  // Fetch products with pagination
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });
  
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  // Handle product creation
  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
        toast.success("Product created successfully");
      } catch (error) {
        console.error("Error creating product", error);
        toast.error("Failed to create product");
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product', error);
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Product List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={createProductHandler}
          disabled={loadingCreate}
        >
          {loadingCreate ? "Creating..." : "Create Product"}
        </Button>
      </Box>

      {isLoading || loadingCreate || loadingDelete ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table
              sx={{
                minWidth: 650,
                "& thead th": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
                "& tbody tr:hover": {
                  backgroundColor: "action.hover",
                },
                "& tbody td": {
                  fontSize: "14px",
                },
              }}
              aria-label="product table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>{product._id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                        sx={{ marginRight: 1 }}
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginate component */}
          <Box mt={4} display="flex" justifyContent="center">
            {data.pages > 1 && (
              <Paginate pages={data.pages} page={data.page} isAdmin={true} />
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default ProductListPage;
