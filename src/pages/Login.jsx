import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const firebaseConfig = {
  apiKey: "AIzaSyA0pvc_FKN-c5qsY_Lb4tqVGDtK7pz3fbg",
  authDomain: "localeventure.firebaseapp.com",
  projectId: "localeventure",
  storageBucket: "localeventure.appspot.com",
  messagingSenderId: "952018081316",
  appId: "1:952018081316:web:d8898e7156da39fb682ab1",
  measurementId: "G-CDHGZRJMTL"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      if (user) {
        navigate('/created-event'); // Redirect to create-event page if login is successful
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid username or password');
    }
  };

  return (
    <div className="auth-wrapper"> {/* Apply auth-wrapper style */}
      <div className="login-container">
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="button" onClick={handleLogin} className="btn-login">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;