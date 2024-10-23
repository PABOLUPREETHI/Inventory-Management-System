import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig'; // Adjust the import as necessary
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import './Products.css';

const Products = () => {
  const conversionRate = 1; // Conversion rate from USD to INR
  const productsCollectionRef = collection(db, 'products'); // Firestore collection reference

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', quantity: '' });
  const [editIndex, setEditIndex] = useState(-1);

  // Fetch products from Firestore on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      const productsArray = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(productsArray);
    };
  
    fetchProducts();
  }, [productsCollectionRef]); // Added productsCollectionRef to the dependency array
  

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Add or Update a product
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    const productData = { ...newProduct, price: newProduct.price * conversionRate };

    if (editIndex === -1) {
      // Add new product
      await addDoc(productsCollectionRef, productData);
    } else {
      // Update existing product
      const productDocRef = doc(db, 'products', products[editIndex].id);
      await updateDoc(productDocRef, productData);
      setEditIndex(-1);
    }

    setNewProduct({ name: '', category: '', price: '', quantity: '' });
    const updatedProducts = await getDocs(productsCollectionRef);
    setProducts(updatedProducts.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  // Edit a product
  const handleEdit = (index) => {
    setEditIndex(index);
    setNewProduct(products[index]);
  };

  // Delete a product
  const handleDelete = async (index) => {
    const productDocRef = doc(db, 'products', products[index].id);
    await deleteDoc(productDocRef);
    const updatedProducts = await getDocs(productsCollectionRef);
    setProducts(updatedProducts.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  return (
    <div className="product-container">
      <h2>Product Management</h2>

      <form onSubmit={handleAddOrUpdate} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price (in INR)"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{editIndex === -1 ? 'Add Product' : 'Save Product'}</button>
      </form>

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price (INR)</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₹{product.price.toLocaleString('en-IN')}</td>
              <td>{product.quantity}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
