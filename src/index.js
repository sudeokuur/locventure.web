import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import CreatedEvents from './pages/CreatedEvents';
import AddCompanyUser from './pages/AddCompanyUser';
import Statistics from './pages/Statistics';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

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
