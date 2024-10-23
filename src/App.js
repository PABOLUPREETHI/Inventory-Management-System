import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Categories from './pages/Categories';
import Products from './pages/Products';
import StockLevels from './pages/StockLevels';
import Suppliers from './pages/Suppliers';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Signup from './pages/Signup';



function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const stockThreshold = 10; // Define your low stock threshold

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categories" element={<Categories categories={categories} setCategories={setCategories} products={products} setProducts={setProducts} />} />
        <Route path="/products" element={<Products products={products} />} />
        <Route path="/stock-levels" element={<StockLevels products={products} stockThreshold={stockThreshold} />} />
        <Route path="/Suppliers" element={<Suppliers/>}/>
        <Route path="/Profile" element={<ProfilePage/>}/>
        
      
       
      </Routes>
    </Router>
  );
}

export default App;
