// InventoryManager.js
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig'; // Adjust the import according to your project structure
import Categories from './Categories';
import StockLevels from './StockLevels';

const InventoryManager = () => {
  const [products, setProducts] = useState([]);

  return (
    <div>
      <Categories setProducts={setProducts} />
      <StockLevels products={products} stockThreshold={5} />
    </div>
  );
};

export default InventoryManager;
