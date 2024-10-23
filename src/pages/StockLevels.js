import React from 'react';
import './StockLevels.css';

const StockLevels = ({ products, stockThreshold }) => {
  return (
    <div className="stock-levels-container">
      <h2>Stock Levels Management</h2>

      <ul className="stock-levels-list">
        {products.map((product) => (
          <li key={product.id} className="stock-item">
            <div>
              <strong>Product:</strong> {product.name}
              <br />
              <strong>Quantity:</strong> {product.quantity}
            </div>

            {/* Display low stock alert if quantity is below threshold */}
            {product.quantity < stockThreshold && (
              <div className="low-stock-alert">
                ⚠️ Low Stock: Only {product.quantity} left!
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockLevels;
