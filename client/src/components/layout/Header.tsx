import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiSearch, FiUser, FiMenu, FiX, FiPlus, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;

  @media (max-width: 768px) {
    padding: 0 var(--spacing-sm);
  }
`;

const Logo = styled(Link)`
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--white);
  text-decoration: none;
  letter-spacing: -0.02em;

  &:hover {
    color: var(--primary-light);
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  margin: 0 var(--spacing-xl);
  position: relative;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 3rem;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  background: rgba(255, 255, 255, 0.15);
  color: var(--white);
  backdrop-filter: blur(10px);

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-lg);
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
  }
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--white);
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    padding: var(--spacing-xs);
    span {
      display: none;
    }
  }
`;

const CreateAdButton = styled(ActionButton)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: var(--white);
    color: var(--primary-color);
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: none;
  border: none;
  color: var(--white);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const UserDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-xs);
  background: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  min-width: 200px;
  overflow: hidden;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all var(--transition-fast);
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  color: var(--gray-700);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: background-color var(--transition-fast);

  &:hover {
    background: var(--gray-100);
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-md);
  background: none;
  border: none;
  color: var(--gray-700);
  text-decoration: none;
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast);

  &:hover {
    background: var(--gray-100);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--white);
  font-size: var(--font-size-xl);
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ads?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <HeaderContainer>
      <NavContainer>
        <Logo to="/">Rubica</Logo>

        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search for ads, services, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchContainer>

        <NavActions>
          <CreateAdButton to="/create-ad">
            <FiPlus />
            <span>Post Ad</span>
          </CreateAdButton>

          {isAuthenticated ? (
            <UserMenu>
              <UserButton 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                onBlur={() => setTimeout(() => setUserMenuOpen(false), 150)}
              >
                <FiUser />
                <span style={{ display: window.innerWidth > 768 ? 'block' : 'none' }}>
                  {user?.firstName}
                </span>
              </UserButton>
              
              <UserDropdown isOpen={userMenuOpen}>
                <DropdownItem to="/dashboard" onClick={() => setUserMenuOpen(false)}>
                  <FiUser />
                  Dashboard
                </DropdownItem>
                <DropdownItem to="/profile" onClick={() => setUserMenuOpen(false)}>
                  <FiSettings />
                  Profile Settings
                </DropdownItem>
                <DropdownButton onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </DropdownButton>
              </UserDropdown>
            </UserMenu>
          ) : (
            <>
              <ActionButton to="/login">
                <FiUser />
                <span>Login</span>
              </ActionButton>
              <ActionButton to="/register">
                <span>Register</span>
              </ActionButton>
            </>
          )}

          <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </MobileMenuButton>
        </NavActions>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;