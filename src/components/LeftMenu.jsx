// LeftMenu.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './LeftMenu.css'; // Import the stylesheet

const LeftMenu = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/create-event">Create Event</Link>
        </li>
        <li>
          <Link to="/created-event">Created Event</Link>
        </li>
      </ul>
    </div>
  );
};

export default LeftMenu;
