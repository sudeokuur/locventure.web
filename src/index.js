import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css';
import AddCompanyUser from './pages/AddCompanyUser';
import CreatedEvents from './pages/CreatedEvents';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Statistics from './pages/Statistics';
import reportWebVitals from './reportWebVitals';

const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const LoginWrapper = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    navigate('/created-event'); // Burada yönlendirme URL'sini düzelttim
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LoginWrapper />
      },
      {
        path: "create-event",
        element: <CreateEvent />
      },
      {
        path: "created-event", // URL burada düzeltilmiş olmalı
        element: <CreatedEvents />
      },
      {
        path: "add-company-user",
        element: <AddCompanyUser />
      },
      {
        path: "statistics",
        element: <Statistics />
      },
      {
        path: "logout",
        element: <Logout />
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
