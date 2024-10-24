import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useProfileMutation } from "../slices/userApiSlice";
import { setCredential } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/orderApiSlice";
import { Link } from "react-router-dom";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Meta from "../components/Meta"; // Import Meta for SEO

function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // Profile picture file
  const [profilePicturePreview, setProfilePicturePreview] = useState(""); // Preview of the image

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setProfilePicturePreview(
        userInfo.profileImage ? `https://backend-shop-five.vercel.app${userInfo.profileImage}` : "" // Load profile image from user info
      );
    }
  }, [userInfo]);

  // Handle profile image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result); // Set preview as base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission for profile update
  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("_id", userInfo._id);
    formData.append("name", name);
    formData.append("email", email);

    if (password) {
      formData.append("password", password); // Attach password if provided
    }

    if (profilePicture) {
      formData.append("image", profilePicture); // Attach profile image if it exists
    }

    try {
      const res = await updateProfile(formData).unwrap();
      dispatch(setCredential(res)); // Update user info, including the profile image
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Meta Component for SEO */}
      <Meta
        title="Profile - LazzyShop"
        description="Update your profile and view your order history at LazzyShop."
        keywords="profile, update profile, order history, LazzyShop"
      />

      <Grid container spacing={3}>
        {/* Left side: Profile Update */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Update Profile
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box component="form" onSubmit={submitHandler} encType="multipart/form-data">
            <Box sx={{ textAlign: "center", mb: 2, position: "relative" }}>
              <Avatar
                alt="Profile Picture"
                src={profilePicturePreview || "/placeholder.png"} // Use preview if available, otherwise show placeholder
                sx={{ width: 100, height: 100, margin: "0 auto" }}
              />

              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 25,
                  right: "calc(50% - 20px)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
              >
                <PhotoCameraIcon />
                <input
                  type="file"
                  name="image"
                  hidden
                  onChange={handleImageChange} // Handle file selection
                  accept="image/*"
                />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {loadingUpdateProfile ? (
              <Loader />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Update Profile
              </Button>
            )}
          </Box>
        </Grid>

        {/* Right side: Order History */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Order History
          </Typography>
          <Divider sx={{ mb: 2 }} />
          {ordersLoading ? (
            <Loader />
          ) : ordersError ? (
            <Typography color="error">Failed to load orders</Typography>
          ) : orders.length === 0 ? (
            <Typography variant="body1">No orders found</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Delivered</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order._id}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {order.isPaid
                          ? new Date(order.paidAt).toLocaleDateString()
                          : "Not Paid"}
                      </TableCell>
                      <TableCell>
                        {order.isDelivered
                          ? new Date(order.deliveredAt).toLocaleDateString()
                          : "Not Delivered"}
                      </TableCell>
                      <TableCell>
                        <Button
                          component={Link}
                          to={`/order/${order._id}`}
                          variant="outlined"
                          color="primary"
                        >
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfilePage;
