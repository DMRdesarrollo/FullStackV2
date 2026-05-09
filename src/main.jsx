import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from "./components/templates/Layout"
import Gallery from "./components/organisms/gallery/Gallery"
import Login from "./components/organisms/login/Login"
import Register from "./components/organisms/register/Register"
import Profile from "./components/organisms/profile/Profile"
import ProductDetail from "./components/organisms/productDetail/ProductDetail"
import Cart from "./components/organisms/cart/Cart"
import Checkout from "./components/organisms/checkout/Checkout"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/gallery" replace />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
