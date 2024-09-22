import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux'; // Corrected import
import { HelmetProvider } from 'react-helmet-async'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import NotFoundPage from './Pages/NotFoundPage'; // Import the NotFoundPage component
import ProductPage from './Pages/ProductPage';
import Cart from './Pages/CartScreen';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import ShippingPage from './Pages/ShippingPage';
import PaymentPage from './Pages/PaymentPage'; // Ensure PaymentPage is imported here
import PlaceOrderPage from './Pages/PlaceOrderPage';
import OrderPage from './Pages/OrderPage';
import PrivateRoutes from './components/PrivateRoutes';
import ProfilePage from './Pages/ProfilePage';
import AdminRoutes from './components/AdminRoutes';
import OrderListPage from './Pages/Admin/OderListPage'; // Corrected component name
import ProductListPage from './Pages/Admin/ProductListPage';
import ProductEditPage from './Pages/Admin/ProductEditPage';
import UserListPage from './Pages/Admin/UserListPage';
import UserEditPage from './Pages/Admin/UserEditPage';

// Define the router with the route configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='/search/:keyword' element={<HomePage />} />
      <Route path='/page/:pageNumber' element={<HomePage />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomePage />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Private Routes */}
      <Route path='' element={<PrivateRoutes />}>
        <Route path='/shipping' element={<ShippingPage />} />
        <Route path='/payment' element={<PaymentPage />} />
        <Route path='/placeorder' element={<PlaceOrderPage />} />
        <Route path='/order/:id' element={<OrderPage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path='' element={<AdminRoutes />}>
        <Route path='/admin/orderslist' element={<OrderListPage />} />
        <Route path='/admin/productslist' element={<ProductListPage />} />
        <Route path='/admin/productslist/:pageNumber' element={<ProductListPage />} />
        <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
        <Route path='/admin/userlist' element={<UserListPage />} />
        <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
    <Provider store={store}> {/* Corrected provider usage */}
        <RouterProvider router={router} />
    </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
