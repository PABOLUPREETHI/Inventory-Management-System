import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {  Link } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig'; // Adjust the path as needed
import './Signup.css'; // Import your CSS styles

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user info to Firestore
      const docRef = await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date(),
      });

      console.log("User added to Firestore with ID:", docRef.id);
      setSuccess('User signed up and added to Firestore');
      // Reset fields after successful signup
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Error signing up or adding to Firestore:", error);
      setError(error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="signup-button">Sign Up</button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default SignupPage;
