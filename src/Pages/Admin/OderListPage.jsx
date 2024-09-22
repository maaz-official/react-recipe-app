import React from "react";
import { useGetOrdersQuery } from "../../slices/orderApiSlice";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

const OrderListPage = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.message}</Message>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 4, maxWidth: "100%", overflowX: "auto" }}>
          <Table
            sx={{
              minWidth: 650,
              "& thead th": {
                backgroundColor: "primary.light",
                color: "white",
              },
              "& tbody td": {
                fontSize: "14px",
              },
            }}
            aria-label="order list table"
          >
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>USER</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell>TOTAL</TableCell>
                <TableCell>PAID</TableCell>
                <TableCell>DELIVERED</TableCell>
                <TableCell>DETAILS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order._id}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: "action.hover",
                    },
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.user && order.user.name}</TableCell>
                  <TableCell>{order.createdAt.substring(0, 10)}</TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <IconButton>
                        <FaTimes style={{ color: "red" }} />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <IconButton>
                        <FaTimes style={{ color: "red" }} />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/order/${order._id}`}
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "primary.main",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
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
    </>
  );
};

export default OrderListPage;
