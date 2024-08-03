// pages/index.tsx
"use client";
import { useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import Header from '../components/Header';
// import AddItemModal from '../components/AddItemModal';
import Items from '../components/Items';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
});

const Home = () => {
  const [openAddModal, setOpenAddModal] = useState(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  return (
    <Box>
      <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <Header />
      <Container>
        {/* <Button variant="contained" onClick={handleOpenAddModal} sx={{ mt: 2 }}>
          Add Item
        </Button>
        <AddItemModal open={openAddModal} handleClose={handleCloseAddModal} /> */}
        <Items />
      </Container>
      </ThemeProvider>
    </Box>
  );
};

export default Home;
