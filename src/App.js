import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import CreateEvent from './pages/CreateEvent';
import CreatedEvents from './pages/CreatedEvents';
import Menu from './pages/Menu';

function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/created-event" element={<CreatedEvents />} />
      </Routes>
    </Router>
  );
}

export default App;
