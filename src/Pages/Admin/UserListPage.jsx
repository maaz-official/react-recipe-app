import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/userApiSlice";
import { FaTrash, FaTimes, FaEdit, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  Box,
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
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

function UserListPage() {
  // Fetch users using API
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation(); // Use the delete mutation

  // Function to handle delete
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap(); // Call deleteUser and unwrap the result
        toast.success("User deleted successfully");
        refetch(); // Refresh the list after deletion
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          textAlign: "center",
          color: "primary.main",
          marginBottom: 3,
        }}
      >
        User List
      </Typography>

      {isLoading && <Loader />}
      {error ? (
        <Message
          variant="danger"
          sx={{
            margin: "20px auto",
            textAlign: "center",
            backgroundColor: "#f8d7da",
            padding: 2,
            borderRadius: "8px",
          }}
        >
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: 3,
            borderRadius: "12px",
          }}
        >
          <Table
            sx={{
              minWidth: 650,
              "& thead th": {
                backgroundColor: "primary.dark",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              },
              "& tbody tr:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
              "& tbody td": {
                fontSize: "16px",
                textAlign: "center",
              },
            }}
            aria-label="user table"
          >
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <a href={`mailto:${user.email}`} style={{ color: "inherit" }}>
                        {user.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green", fontSize: "20px" }} />
                      ) : (
                        <FaTimes style={{ color: "red", fontSize: "20px" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/admin/user/${user._id}/edit`}
                        sx={{ marginRight: 1 }}
                      >
                        <FaEdit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => deleteHandler(user._id)}
                        disabled={loadingDelete} // Disable button while deleting
                      >
                        <FaTrash />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default UserListPage;
