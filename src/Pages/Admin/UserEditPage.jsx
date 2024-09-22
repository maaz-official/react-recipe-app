import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../../slices/userApiSlice";
import { Button, TextField, Box, Typography, FormControlLabel, Checkbox } from "@mui/material";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const UserEditPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  // Fetch user details by ID
  const { data: user, isLoading, error, refetch } = useGetUserByIdQuery(userId);

  // Update user mutation
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  // Local state for the form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Set the form fields when the user data is fetched
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  // Handle form submission for updating the user
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateUser({
        id: userId,
        name,
        email,
        isAdmin,
      }).unwrap();

      toast.success("User updated successfully");
      refetch(); // Refetch user data
      navigate("/admin/userlist"); // Navigate back to the user list after updating
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "500px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, textAlign: "center", color: "primary.main", marginBottom: 3 }}>
        Edit User
      </Typography>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <Box component="form" onSubmit={submitHandler} noValidate sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <FormControlLabel
            control={<Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />}
            label="Admin"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loadingUpdate}
            fullWidth
          >
            {loadingUpdate ? "Updating..." : "Update User"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserEditPage;
