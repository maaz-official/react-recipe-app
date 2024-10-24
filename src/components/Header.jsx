import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  InputAdornment,
  TextField,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { FaPhone, FaHeart, FaShoppingBag, FaSearch, FaHome, FaTimes, FaUser, FaCog } from 'react-icons/fa';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useLogoutMutation } from '../slices/userApiSlice'; // Import the logout mutation
import { logout } from '../slices/authSlice'; // Import the logout action from authSlice
import { useSelector, useDispatch } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { keyword: urlKeyword } = useParams(); // Extract keyword from URL params if it exists
  const [keyword, setKeyword] = useState(urlKeyword || ''); // Set keyword from URL params or initialize to empty string

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword('')
      navigate(`/search/${keyword}`); // Navigate to search results page with keyword
    } else {
      navigate('/'); // Navigate back to homepage if no keyword is provided
    }
  };

  const [logoutApi] = useLogoutMutation(); // Initialize the logout mutation

  const location = useLocation(); // Get current route location
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [searchOpen, setSearchOpen] = useState(false); // State to control the search visibility
  const [anchorEl, setAnchorEl] = useState(null); // For profile dropdown on large screens
  const [adminAnchorEl, setAdminAnchorEl] = useState(null); // For admin dropdown

  const handleProfileMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Open profile dropdown
  };

  const handleAdminMenuClick = (event) => {
    setAdminAnchorEl(event.currentTarget); // Open admin dropdown
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close profile dropdown
    setAdminAnchorEl(null); // Close admin dropdown
  };

  const logoutHandler = async () => {
    try {
      await logoutApi(); // Call the API to logout
      dispatch(logout()); // Dispatch the logout action to clear Redux state and localStorage
      navigate('/login'); // Redirect to the login page after successful logout
    } catch (error) {
      console.error('Failed to logout:', error); // Handle error if logout fails
    }
    handleMenuClose(); // Close the menu after logging out
  };

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev); // Toggle search component visibility
  };

  // Determine the active route to apply the blue color
  const isActive = (path) => location.pathname === path;

  return (
    <header>
      {/* Top Navigation Bar */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          width: '100%', // Ensures AppBar is always full-width
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', padding: '10px 20px' }}>
          {/* Logo - Visible on all screens */}
          <Box component={Link} to="/" sx={{ textDecoration: 'none' }}>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 'bold' }}>
              <img src="/nbs.png" alt="Logo" style={{ width: '70px', height: 'auto', marginLeft: '20px' }} />
            </Typography>
          </Box>

          {/* Contact Info - Hidden on mobile */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: '10px' }}>
            <FaPhone style={{ color: '#333' }} />
            <Typography variant="body2" sx={{ color: '#333' }}>
              <a href="tel:+923417012094" style={{ textDecoration: 'none', color: '#333' }}>
                +92 (341) 7012094
              </a>
            </Typography>
          </Box>

          {/* User Navigation and Search Icon - Hidden on mobile */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: '20px' }}>
            {/* Search Icon for larger screens */}
            <IconButton onClick={handleSearchToggle}>
              <FaSearch style={{ color: '#333', fontSize: '24px' }} />
            </IconButton>

            {/* Dropdown for Profile & Logout on Large Screens */}
            {userInfo ? (
              <>
                <IconButton onClick={handleProfileMenuClick} sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {/* Display profile picture or fallback to user icon */}
                  {userInfo.profileImage ? (
                    <Avatar src={userInfo.profileImage}/>
                  ) : (
                    <Avatar>
                      <FaUser style={{ color: '#fff' }} />
                    </Avatar>
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={{ display: { xs: 'none', md: 'block' } }}
                >
                  <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </Menu>

                {/* Separate Admin Icon and Dropdown */}
                {userInfo && userInfo.isAdmin && (
                  <>
                    <IconButton onClick={handleAdminMenuClick} sx={{ display: { xs: 'none', md: 'flex' } }}>
                      <FaCog style={{ color: '#333', fontSize: '24px' }} />
                    </IconButton>
                    <Menu
                      anchorEl={adminAnchorEl}
                      open={Boolean(adminAnchorEl)}
                      onClose={handleMenuClose}
                      sx={{ display: { xs: 'none', md: 'block' } }}
                    >
                      <MenuItem onClick={handleMenuClose} component={Link} to="/admin/productslist">
                        Product List
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose} component={Link} to="/admin/userlist">
                        Users List
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose} component={Link} to="/admin/orderslist">
                        Orders List
                      </MenuItem>
                      {/* Add more admin options here as needed */}
                    </Menu>
                  </>
                )}
              </>
            ) : (
              <IconButton component={Link} to="/login" sx={{ display: { xs: 'none', md: 'flex' } }}>
                <FaUser style={{ color: '#333' }} />
              </IconButton>
            )}

            <IconButton component={Link} to="/favorites" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <FaHeart style={{ color: '#333' }} />
            </IconButton>

            <IconButton component={Link} to="/cart" sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Badge badgeContent={cartItems.reduce((total, item) => total + item.qty, 0)} color="secondary">
                <FaShoppingBag style={{ color: '#333' }} />
              </Badge>
            </IconButton>
          </Box>

          {/* Search Icon in the middle for mobile */}
          <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
            <IconButton onClick={handleSearchToggle}>
              <FaSearch style={{ color: '#333', fontSize: '24px' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Search Bar with Close Icon */}
      {searchOpen && (
        <Box sx={{ position: 'relative', backgroundColor: '#ffffff', zIndex: 2000 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', lg: 'center' }, // Centered for both small and large screens
              alignItems: 'center',
              padding: '10px 20px',
              width: { xs: '100%', lg: '50%' }, // Full width on small devices, 50% on larger screens
              margin: { lg: '0 auto' }, // Center horizontally on large screens
            }}
          >
            <form onSubmit={searchHandler} style={{ width: '100%', display: 'flex' }}>
              <TextField
                fullWidth
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaSearch style={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleSearchToggle}>
                        <FaTimes style={{ color: '#666' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ backgroundColor: '#fff', width: { xs: '100%', lg: '100%' } }} // Full width on mobile and large screens
              />
            </form>
          </Box>
        </Box>
      )}

{/* Bottom Navigation Bar - Visible Only on Mobile */}
<Box
  sx={{
    display: { xs: 'flex', sm: 'flex', md: 'none', lg: 'none' }, // Hide on tablets and larger screens
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    zIndex: 1000,
    animation: 'slideUp 0.5s ease-in-out',
  }}
>
  {/* Home Icon */}
  <IconButton
    component={Link}
    to="/"
    className="nav-item"
    sx={{
      backgroundColor: isActive('/') ? '#6200EA' : 'transparent', // Active state background color
      borderRadius: '50%',
      padding: '10px',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: '#6200EA', // Hover effect
      },
    }}
  >
    <FaHome
      className={`bottom-icon ${isActive('/') ? 'active' : ''}`}
      style={{
        fontSize: '28px',
        color: isActive('/') ? '#fff' : '#999', // Change color based on active state
        transition: 'color 0.3s ease',
      }}
    />
  </IconButton>

  {/* Favorites Icon */}
  <IconButton
    component={Link}
    to="/favorites"
    className="nav-item"
    sx={{
      backgroundColor: isActive('/favorites') ? '#6200EA' : 'transparent', // Active state background color
      borderRadius: '50%',
      padding: '10px',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: '#6200EA', // Hover effect
      },
    }}
  >
    <FaHeart
      className={`bottom-icon ${isActive('/favorites') ? 'active' : ''}`}
      style={{
        fontSize: '28px',
        color: isActive('/favorites') ? '#fff' : '#999', // Change color based on active state
        transition: 'color 0.3s ease',
      }}
    />
  </IconButton>

  {/* Cart Icon */}
  <IconButton
    component={Link}
    to="/cart"
    className="nav-item"
    sx={{
      backgroundColor: isActive('/cart') ? '#6200EA' : 'transparent', // Active state background color
      borderRadius: '50%',
      padding: '10px',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: '#6200EA', // Hover effect
      },
    }}
  >
    <Badge
      badgeContent={cartItems.reduce((total, item) => total + item.qty, 0)}
      color="secondary"
      sx={{
        '& .MuiBadge-badge': {
          backgroundColor: isActive('/cart') ? '#fff' : '#f50057', // Badge color based on active state
          color: isActive('/cart') ? '#6200EA' : '#fff', // Text color based on active state
        },
      }}
    >
      <FaShoppingBag
        className={`bottom-icon ${isActive('/cart') ? 'active' : ''}`}
        style={{
          fontSize: '28px',
          color: isActive('/cart') ? '#fff' : '#999', // Change color based on active state
          transition: 'color 0.3s ease',
        }}
      />
    </Badge>
  </IconButton>

  {/* Profile Icon in the Middle */}
  <Box
    sx={{
      backgroundColor: '#6200EA', // Add a background color for better contrast
      color: 'white',
      padding: '8px', // Increase padding for a balanced appearance
      borderRadius: '50%', // Keep the circle shape
      transform: 'translateY(-20px)', // Adjust the vertical position slightly
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // Add a soft shadow for depth
      border: '2px solid #fff', // White border for a clean look
      transition: 'transform 0.3s ease', // Smooth animation on hover
      '&:hover': {
        transform: 'translateY(-25px) scale(1.05)', // Hover effect to lift the icon slightly
        boxShadow: '0px 6px 14px rgba(0, 0, 0, 0.3)', // Enhance shadow on hover
      },
    }}
  >
    <IconButton
      component={Link}
      to={userInfo ? '/profile' : '/login'} // If logged in, redirect to profile, otherwise to login
      sx={{
        padding: 0, // Remove extra padding from the IconButton
      }}
    >
      {userInfo?.profileImage ? (
        <Avatar
          src={userInfo.profileImage}
          alt={userInfo.name}
          sx={{
            width: 50,
            height: 50,
            border: '2px solid #fff', // Add a border to the avatar for a refined look
            transition: 'box-shadow 0.3s ease', // Smooth transition on hover
            '&:hover': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add a shadow effect to the avatar on hover
            },
          }}
        />
      ) : (
        <FaUser
          className={`bottom-icon-active ${isActive(userInfo ? '/profile' : '/login') ? 'active' : ''}`}
          style={{
            fontSize: '28px', // Adjust the icon size
            color: '#fff', // Set icon color to white
          }}
        />
      )}
    </IconButton>
  </Box>
</Box>


      {/* Keyframes for transitions */}
      <style>
        {`
          .bottom-icon {
            color: #999999;
            font-size: 24px;
            transition: color 0.3s ease, transform 0.3s ease;
          }

          .bottom-icon.active {
            color: #6200EA;
            transform: scale(1.2);
          }

          .bottom-icon:hover, .nav-item.active .bottom-icon {
            transform: scale(1.2);
          }

          .bottom-icon-active {
            color: white;
            font-size: 24px;
            animation: pulse 1.2s infinite ease-in-out;
          }

          @keyframes iconHover {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.15);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            30% {
              transform: scale(1.1);
            }
            60% {
              transform: scale(1.15);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;
