import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig'; // Adjust the import according to your file structure
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './Suppliers.css';

const Suppliers = () => {
  // Initial state for suppliers
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', products: [{ name: '', quantity: '' }] });
  const [editingIndex, setEditingIndex] = useState(-1); // For updating suppliers

  // Fetch suppliers from Firestore on mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      const suppliersCollection = collection(db, 'suppliers');
      const supplierDocs = await getDocs(suppliersCollection);
      setSuppliers(supplierDocs.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchSuppliers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      // Update product details in case of multiple products
      const updatedProducts = [...newSupplier.products];
      updatedProducts[index][name] = value;
      setNewSupplier({ ...newSupplier, products: updatedProducts });
    } else {
      setNewSupplier({ ...newSupplier, [name]: value });
    }
  };

  // Add another product input for the supplier
  const handleAddProduct = () => {
    setNewSupplier({ ...newSupplier, products: [...newSupplier.products, { name: '', quantity: '' }] });
  };

  // Add a new supplier to Firestore
  const handleAddSupplier = async () => {
    if (newSupplier.name && newSupplier.contact && newSupplier.products.length > 0) {
      const docRef = await addDoc(collection(db, 'suppliers'), newSupplier);
      setSuppliers([...suppliers, { ...newSupplier, id: docRef.id }]);
      setNewSupplier({ name: '', contact: '', products: [{ name: '', quantity: '' }] });
    }
  };

  // Delete a supplier by ID
  const handleDeleteSupplier = async (id) => {
    await deleteDoc(doc(db, 'suppliers', id));
    const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
    setSuppliers(updatedSuppliers);
  };

  // Start editing a supplier
  const handleEditSupplier = (index) => {
    setEditingIndex(index);
    setNewSupplier(suppliers[index]);
  };

  // Save the edited supplier
  const handleSaveSupplier = async () => {
    const updatedSuppliers = [...suppliers];
    const supplierId = updatedSuppliers[editingIndex].id;
    await updateDoc(doc(db, 'suppliers', supplierId), { ...newSupplier, id: supplierId });
    updatedSuppliers[editingIndex] = { ...newSupplier, id: supplierId };
    setSuppliers(updatedSuppliers);
    setNewSupplier({ name: '', contact: '', products: [{ name: '', quantity: '' }] });
    setEditingIndex(-1); // Reset editing index
  };

  // Delete a specific product for a supplier
  const handleDeleteProduct = (supplierIndex, productIndex) => {
    const updatedSuppliers = [...suppliers];
    const updatedProducts = updatedSuppliers[supplierIndex].products.filter((_, idx) => idx !== productIndex);
    updatedSuppliers[supplierIndex].products = updatedProducts;
    setSuppliers(updatedSuppliers);
  };

  return (
    <div className="suppliers-container">
      <h2>Suppliers Management</h2>

      {/* Supplier form */}
      <div className="supplier-form">
        <input
          type="text"
          name="name"
          placeholder="Supplier Name"
          value={newSupplier.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={newSupplier.contact}
          onChange={handleInputChange}
        />

        {newSupplier.products.map((product, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => handleInputChange(e, index)}
            />
            <input
              type="text"
              name="quantity"
              placeholder="Quantity"
              value={product.quantity}
              onChange={(e) => handleInputChange(e, index)}
            />
          </div>
        ))}

        <button onClick={handleAddProduct}>Add Another Product</button>

        {editingIndex === -1 ? (
          <button onClick={handleAddSupplier}>Add Supplier</button>
        ) : (
          <button onClick={handleSaveSupplier}>Save Supplier</button>
        )}
      </div>

      {/* List of suppliers */}
      <ul className="suppliers-list">
        {suppliers.map((supplier, supplierIndex) => (
          <li key={supplier.id} className="supplier-item">
            <div>
              <strong>Name:</strong> {supplier.name}
              <br />
              <strong>Contact:</strong> {supplier.contact}
              <br />
              <strong>Products:</strong>
              <ul>
                {supplier.products.map((product, productIndex) => (
                  <li key={productIndex}>
                    {product.name} - {product.quantity}
                    <button onClick={() => handleDeleteProduct(supplierIndex, productIndex)}>
                      Delete Product
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="supplier-actions">
              <button onClick={() => handleEditSupplier(supplierIndex)}>Edit</button>
              <button onClick={() => handleDeleteSupplier(supplier.id)}>Delete Supplier</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Suppliers;
