import React from 'react';
import Header from './components/Header';
import { Container } from 'react-bootstrap';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      {/* Header Section */}
      <Header />

      {/* Main Content Section */}
      <main className='py-3'>
        <Container fluid="md">
          <Outlet />
        </Container>
      </main>

      {/* Footer Section */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
