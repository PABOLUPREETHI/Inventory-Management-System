import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebaseConfig'; // Adjust the path as needed
import { deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import './ProfilePage.css';

const ProfilePage = () => {
  const [shopDetails, setShopDetails] = useState({});
  const [editing, setEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setShopDetails(data);
          setUpdatedDetails(data); // Initialize updatedDetails with fetched data
        }
      });

      return () => unsubscribe(); // Cleanup subscription on unmount
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({ ...updatedDetails, [name]: value });
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    if (editing) {
      setShopDetails(updatedDetails); // Save changes when editing is toggled off
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser; // Get the currently logged-in user
    if (user) {
      const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document in Firestore

      try {
        // Delete the user document from Firestore
        await deleteDoc(userDocRef);
        console.log('User document deleted from Firestore.');

        // Delete the user account from Firebase Authentication
        await user.delete();
        console.log('User account deleted from Firebase Authentication.');
        
        // Optionally, redirect the user or show a success message
        alert('Your account has been deleted successfully.');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account: ' + error.message);
      }
    }
  };

  return (
    <div className="profile-container">
      <h1>{shopDetails.name || "Your Shop"} - Profile</h1>

      <div className="profile-details">
        <h2>Owner Details</h2>
        <div className="detail-item">
          <strong>Owner Name:</strong>
          {editing ? (
            <input
              type="text"
              name="ownerName"
              value={updatedDetails.ownerName}
              onChange={handleChange}
            />
          ) : (
            <span>{shopDetails.ownerName}</span>
          )}
        </div>
        <div className="detail-item">
          <strong>Email:</strong>
          {editing ? (
            <input
              type="email"
              name="email"
              value={updatedDetails.email}
              onChange={handleChange}
            />
          ) : (
            <span>{shopDetails.email}</span>
          )}
        </div>
        <div className="detail-item">
          <strong>Contact:</strong>
          {editing ? (
            <input
              type="tel"
              name="contact"
              value={updatedDetails.contact}
              onChange={handleChange}
            />
          ) : (
            <span>{shopDetails.contact}</span>
          )}
        </div>
        <div className="detail-item">
          <strong>Address:</strong>
          {editing ? (
            <input
              type="text"
              name="address"
              value={updatedDetails.address}
              onChange={handleChange}
            />
          ) : (
            <span>{shopDetails.address}</span>
          )}
        </div>
        <div className="detail-item">
          <strong>Business Hours:</strong>
          {editing ? (
            <input
              type="text"
              name="businessHours"
              value={updatedDetails.businessHours}
              onChange={handleChange}
            />
          ) : (
            <span>{shopDetails.businessHours}</span>
          )}
        </div>
        <div className="detail-item">
          <strong>Social Media:</strong>
          {editing ? (
            <input
              type="text"
              name="socialMedia"
              value={updatedDetails.socialMedia}
              onChange={handleChange}
            />
          ) : (
            <span>{shopDetails.socialMedia}</span>
          )}
        </div>
        <div className="detail-item">
          <strong>Payment Methods:</strong>
          {editing ? (
            <input
              type="text"
              name="paymentMethods"
              value={updatedDetails.paymentMethods}
              onChange={handleChange}
            />
          ) : (
            <span>{shopDetails.paymentMethods}</span>
          )}
        </div>
        <div className="detail-item">
          <strong>Discounts:</strong>
          {editing ? (
            <input
              type="text"
              name="discounts"
              value={updatedDetails.discounts}
              onChange={handleChange}
            />
          ) : (
            <span>{shopDetails.discounts}</span>
          )}
        </div>
      </div>

      <button onClick={handleEditToggle} className="edit-button">
        {editing ? 'Save Changes' : 'Edit Profile'}
      </button>

      <button onClick={handleDeleteAccount} className="delete-button">
        Delete Account
      </button>

      <footer>
        <p>eMart Grocery Management &copy; 2024</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
