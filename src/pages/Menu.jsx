import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Sidebar = styled.div`
  height: 100%;
  width: ${(props) => (props.isOpen ? '180px' : '0')};
  position: fixed;
  top: 0;
  left: 0;
  background-color: #111827; /* Lacivert */
  overflow-x: hidden;
  transition: width 0.5s;
  padding-top: 60px;
  z-index: 1000;
`;

const SidebarLink = styled(Link)`
  display: block;
  padding: 16px;
  color: #fff;
  text-decoration: none;
  transition: 0.3s;
  &:hover {
    background-color: #3F0E40; /* Koyu Lacivert Hover */
  }
`;

const Content = styled.div`
  margin-left: ${(props) => (props.isOpen ? '250px' : '0')};
  transition: margin-left 0.5s;
  padding: 16px;
`;

const PageContainer = styled.div`
  background-color: #fff; /* Beyaz */
`;

const MenuButton = styled.button`
  position: fixed;
  top: 12px;
  left: ${(props) => (props.isOpen ? '100px' : '20px')};
  z-index: 1100;
  background-color: #111827; /* Lacivert */
  color: #fff;
  border: 1px solid #fff; /* İnce beyaz çember */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: left 0.5s;
`;

const MenuIcon = styled.span`
  font-size: 24px;
`;

const LogoutButton = styled.button`
  display: block;
  padding: 16px;
  color: #fff;
  background-color: #111827; /* Lacivert */
  border: none;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
`;

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Perform logout actions
    // For example, clear session or token
    // Then redirect to the login page
    window.location.href = '/'; // Redirect to login page
  };

  return (
    <React.Fragment>
      <MenuButton isOpen={isOpen} onClick={toggleMenu}>
        <MenuIcon>{isOpen ? '<' : '>'}</MenuIcon>
      </MenuButton>
      <Sidebar isOpen={isOpen}>
        <SidebarLink to="/create-event" onClick={() => setIsOpen(false)}>Create Event</SidebarLink>
        <SidebarLink to="/created-events" onClick={() => setIsOpen(false)}>Created Events</SidebarLink>
        <SidebarLink to="/statistics" onClick={() => setIsOpen(false)}>Statistics</SidebarLink>
        <SidebarLink to="/add-company-user" onClick={() => setIsOpen(false)}>Add Company & User</SidebarLink>
        {/* Logout Button */}
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
      <PageContainer>
        {/* Content goes here */}
      </PageContainer>
    </React.Fragment>
  );
};

export default Menu;
