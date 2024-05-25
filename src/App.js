import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddCompanyUser from './pages/AddCompanyUser';
import CreateEvent from './pages/CreateEvent';
import CreatedEvents from './pages/CreatedEvents';
import Login from './pages/Login';
import Logout from './pages/Logout'; // Import Logout component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Navbar/*" element={<Navbar />} /> {/* Use wildcard to match any route starting with /menu */}
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/created-event" element={<CreatedEvents />} />
        <Route path="/logout" element={<Logout />} /> {/* Define route for /logout */}
        <Route path="/add-company-user" element={<AddCompanyUser />} />
      </Routes>
    </Router>
  );
}

export default App;
