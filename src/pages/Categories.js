import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig'; // Adjust the import according to your file structure
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

import './Categories.css';


const Categories = ({ setProducts }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', products: [{ name: '', quantity: '' }] });
  const [editingIndex, setEditingIndex] = useState(-1);
  

  // Fetch categories from Firestore on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(db, 'categories');
      const categoryDocs = await getDocs(categoriesCollection);
      setCategories(categoryDocs.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };
    fetchCategories();
  }, []);

  // Update Firestore whenever categories change
  useEffect(() => {
    const saveCategories = async () => {
      const categoriesCollection = collection(db, 'categories');
      await Promise.all(categories.map(async (category) => {
        const categoryDoc = doc(categoriesCollection, category.id);
        await updateDoc(categoryDoc, category);
      }));
    };
    saveCategories();
  }, [categories]);

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedProducts = [...newCategory.products];
      updatedProducts[index][name] = value;
      setNewCategory({ ...newCategory, products: updatedProducts });
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
  };

  const handleAddProduct = () => {
    setNewCategory({ ...newCategory, products: [...newCategory.products, { name: '', quantity: '' }] });
  };

  const handleAddCategory = async () => {
    if (newCategory.name && newCategory.products.length > 0) {
      const newCat = { ...newCategory };
      const docRef = await addDoc(collection(db, 'categories'), newCat);
      newCat.id = docRef.id; // Assign the generated ID
      setCategories([...categories, newCat]);

      // Also add products to the global products list
      newCategory.products.forEach(product => {
        setProducts(products => [...products, { ...product, category: newCategory.name, id: products.length + 1 }]);
      });

      setNewCategory({ name: '', products: [{ name: '', quantity: '' }] });
    }
  };

  const handleDeleteCategory = async (id) => {
    await deleteDoc(doc(db, 'categories', id));
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
  };

  const handleEditCategory = (index) => {
    setEditingIndex(index);
    setNewCategory(categories[index]);
  };

  const handleSaveCategory = async () => {
    const updatedCategories = [...categories];
    const updatedCategory = { ...newCategory };
    await updateDoc(doc(db, 'categories', updatedCategory.id), updatedCategory);
    updatedCategories[editingIndex] = updatedCategory;
    setCategories(updatedCategories);
    setNewCategory({ name: '', products: [{ name: '', quantity: '' }] });
    setEditingIndex(-1);
  };

  const handleDeleteProduct = (categoryIndex, productIndex) => {
    const updatedCategories = [...categories];
    const updatedProducts = updatedCategories[categoryIndex].products.filter((_, idx) => idx !== productIndex);
    updatedCategories[categoryIndex].products = updatedProducts;
    setCategories(updatedCategories);
  };

  

  return (
    <div className="categories-container">
      <h2>Categories Management</h2>
      {/* Category form */}
      <div className="category-form">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={handleInputChange}
        />
        {newCategory.products.map((product, index) => (
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
          <button onClick={handleAddCategory}>Add Category</button>
        ) : (
          <button onClick={handleSaveCategory}>Save Category</button>
        )}
      </div>

      {/* List of categories */}
      <ul className="categories-list">
        {categories.map((category, categoryIndex) => (
          <li key={category.id} className="category-item">
            <div>
              <strong>Category:</strong> {category.name}
              <br />
              <strong>Products:</strong>
              <ul>
                {category.products.map((product, productIndex) => (
                  <li key={productIndex}>
                    {product.name} - {product.quantity}
                    <button onClick={() => handleDeleteProduct(categoryIndex, productIndex)}>
                      Delete Product
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="category-actions">
              <button onClick={() => handleEditCategory(categoryIndex)}>Edit</button>
              <button onClick={() => handleDeleteCategory(category.id)}>Delete Category</button>
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default Categories;
