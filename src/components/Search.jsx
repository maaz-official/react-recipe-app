import React, { useState } from 'react';
import { Box, TextField, List, ListItem, Typography, Divider, IconButton, InputAdornment } from '@mui/material';
import { FaSearch, FaTimes } from 'react-icons/fa';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Sample data for Campaigns and Products
  const campaigns = ['Campaign Name Fintory', 'Fintory Campaign Name'];
  const products = ['Product Name Fintory', 'Fintory Product Name', 'Another Product Name Fintory'];

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value.trim() !== '') {
      // Mock search results
      const filteredCampaigns = campaigns.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
      const filteredProducts = products.filter((item) => item.toLowerCase().includes(value.toLowerCase()));
      setSearchResults({ campaigns: filteredCampaigns, products: filteredProducts });
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '300px', margin: '0 auto' }}>
      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FaSearch />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={clearSearch}>
                <FaTimes />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ backgroundColor: '#fff' }}
      />

      {/* Search Results Dropdown */}
      {showResults && (
        <Box
          sx={{
            position: 'absolute',
            top: '48px', // Aligning just below the input box
            width: '100%',
            backgroundColor: '#fff',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
            zIndex: 1000,
          }}
        >
          <List>
            {/* Campaigns Section */}
            <Typography variant="caption" sx={{ padding: '8px 16px', fontWeight: 'bold' }}>
              Campaigns
            </Typography>
            {searchResults.campaigns.length > 0 ? (
              searchResults.campaigns.map((campaign, index) => (
                <ListItem key={index}>
                  <FaSearch style={{ marginRight: '8px' }} /> {campaign}
                </ListItem>
              ))
            ) : (
              <ListItem>No campaigns found</ListItem>
            )}

            <Divider />

            {/* Products Section */}
            <Typography variant="caption" sx={{ padding: '8px 16px', fontWeight: 'bold' }}>
              Products
            </Typography>
            {searchResults.products.length > 0 ? (
              searchResults.products.map((product, index) => (
                <ListItem key={index}>
                  <FaSearch style={{ marginRight: '8px' }} /> {product}
                </ListItem>
              ))
            ) : (
              <ListItem>No products found</ListItem>
            )}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default Search;
