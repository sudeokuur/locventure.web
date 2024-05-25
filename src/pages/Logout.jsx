import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('userToken');
    // Navigate user to the login page
    navigate('/');
  };

  // Immediately handle logout when the component renders
  handleLogout();

  // Render nothing since the navigation happens immediately
  return null;
};

export default Logout;
