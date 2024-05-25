import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    // Perform any logout logic here (e.g., clear session, remove tokens, etc.)
    // For demonstration purposes, let's assume we just navigate to the login page
    navigate('/');
  };

  const handleCancel = () => {
    // If user cancels, close the confirmation message
    setConfirmLogout(false);
  };

  return (
    <div style={styles.container}>
      {confirmLogout ? (
        <div style={styles.confirmContainer}>
          <p style={styles.question}>Are you sure you want to logout?</p>
          <div style={styles.buttonContainer}>
            <button style={{ ...styles.button, backgroundColor: 'red' }} onClick={handleLogout}>Logout</button>
            <button style={{ ...styles.button, backgroundColor: 'grey' }} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <button style={{ ...styles.logoutButton, backgroundColor: 'blue' }} onClick={() => setConfirmLogout(true)}>Logout</button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  confirmContainer: {
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  question: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    fontSize: '16px',
    padding: '10px 20px',
    color: 'white',
    margin: '0 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  },
  logoutButton: {
    fontSize: '16px',
    padding: '10px 20px',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
  },
};

export default Logout;
