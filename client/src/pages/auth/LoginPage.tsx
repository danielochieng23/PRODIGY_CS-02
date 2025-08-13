import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--gray-50);
`;

const LoginForm = styled.form`
  background: var(--white);
  padding: 3rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: var(--gray-900);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--primary-gradient);
  color: var(--white);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: var(--gray-600);
  font-size: var(--font-size-sm);

  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: var(--font-weight-medium);

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { login: loginUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser({ login, password });
      navigate(from, { replace: true });
    } catch (error) {
      // Error handled by auth context
    }
  };

  return (
    <Container>
      <LoginForm onSubmit={handleSubmit}>
        <Title>Welcome Back</Title>
        <FormGroup>
          <Input
            type="text"
            placeholder="Username or Email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
        <LinkText>
          Don't have an account? <Link to="/register">Sign up here</Link>
        </LinkText>
      </LoginForm>
    </Container>
  );
};

export default LoginPage;