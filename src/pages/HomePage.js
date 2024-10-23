import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; // Correct import path
import './HomePage.css';
import inventoryImage from '../assets/inventory1.png';

const HomePage = ({ products = [], suppliers = [], categories = [] }) => {
  const navigate = useNavigate();
  const [lowStockCount, setLowStockCount] = useState(0);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    // Function to calculate low stock items
    const calculateLowStock = () => {
      const lowStockThreshold = 5; // Set your threshold for low stock
      const count = products.filter(product => product.quantity < lowStockThreshold).length;
      setLowStockCount(count);
    };

    calculateLowStock(); // Calculate low stock items when component mounts or products change
  }, [products]); // Update this dependency if `products` is coming from props

  return (
    <div className="dashboard-container">
      <header>
        <h1>Inventory Management</h1>
      </header>

      <nav className="nav-bar">
        <Link to="/products" className="nav-link">Products</Link>
        <Link to="/suppliers" className="nav-link">Suppliers</Link>
        <Link to="/categories" className="nav-link">Categories</Link>
        <Link to="/stock-levels" className="nav-link">Stock Levels</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <button onClick={handleLogout}>Sign Out</button>
      </nav>

      <img src={inventoryImage} alt="Inventory" className="inventory-image" />

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Products</h2>
          <p>Total Products: {products.length}</p>
          <Link to="/products" className="card-link">View Details</Link>
        </div>

        <div className="dashboard-card">
          <h2>Suppliers</h2>
          <p>Total Suppliers: {suppliers.length}</p>
          <Link to="/suppliers" className="card-link">View Details</Link>
        </div>

        <div className="dashboard-card">
          <h2>Categories</h2>
          <p>Total Categories: {categories.length}</p>
          <Link to="/categories" className="card-link">View Details</Link>
        </div>

        <div className="dashboard-card">
          <h2>Stock Levels</h2>
          <p>Low Stock Items: {lowStockCount}</p>
          <Link to="/stock-levels" className="card-link">View Details</Link>
        </div>

        <div className="dashboard-card">
          <h2>Profile</h2>
          <p>Manage your profile settings.</p>
          <Link to="/profile" className="card-link">View Profile</Link>
        </div>
      </section>

      <footer>
        <p>eMart Grocery Management &copy; 2024</p>
      </footer>
    </div>
  );
};

export default HomePage;
