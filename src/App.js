import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddCompanyUser from './pages/AddCompanyUser';
import CreateEvent from './pages/CreateEvent';
import CreatedEvents from './pages/CreatedEvents';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu/*" element={<Menu />} /> {/* Use wildcard to match any route starting with /menu */}
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/created-event" element={<CreatedEvents />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/add-company-user" element={<AddCompanyUser />} />
      </Routes>
    </Router>
  );
}

export default App;
