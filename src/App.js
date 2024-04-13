import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddCompanyUser from './pages/AddCompanyUser';
import CreateEvent from './pages/CreateEvent';
import CreatedEvents from './pages/CreatedEvents';
import Login from './pages/Login'; // Assuming you have a Login page
import Menu from './pages/Menu';

function App() {
  return (
    <Router>
      <Menu /> {/* Render the Menu component outside of the Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/created-event" element={<CreatedEvents />} />
        <Route path="/add-company-user" element={<AddCompanyUser/>} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
