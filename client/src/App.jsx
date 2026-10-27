import { Routes, Route } from 'react-router-dom';
import Nav from './nav';
import Home from './home';
import About from './about';
import Services from './services';
import Contact from './contact';
import Products from './products';
import ProductDetail from './productDetail';
import Login from './login';
import Signup from './signup';
import Cart from './cart';
import Checkout from './checkout';
import Profile from './profile';
import Orders from './orders';
import NotFound from './notFound';
import './App.css';

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        {/* Core Routes from Reference */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* Required Compulsory & High Scoring Routes */}
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
