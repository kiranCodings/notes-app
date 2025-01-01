import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './main.css';

const Login = () => {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const { login } = useAuth();

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const res = await axios.post('http://localhost:5000/api/auth/login', {
       email,
       password,
     });
     login(res.data.token);
   } catch (error) {
     console.error('Login Error:', error.response.data.message);
   }
 };

 return (
   <div className="login-wrapper">
     <div className="login-box">
       <div className="login-header">
         <h2>Login</h2>
         <p>Welcome back! Please enter your details.</p>
       </div>
       <form onSubmit={handleSubmit}>
         <div className="form-group">
           <label>Email</label>
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
           />
         </div>
         <div className="form-group">
           <label>Password</label>
           <input
             type="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
           />
         </div>
         <button type="submit">Sign in</button>
       </form>
       <p className="login-link">
         Don't have an account? <a href="/register">Sign up</a>
       </p>
     </div>
   </div>
 );
};

export default Login;