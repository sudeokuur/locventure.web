// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LeftMenu from './components/LeftMenu';
import CreateEvent from './pages/CreateEvent';
import CreatedEvents from './pages/CreatedEvents';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <LeftMenu />
        <div style={{ marginLeft: '200px', padding: '20px' }}>
          <Routes>
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/created-event" element={<CreatedEvents />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
