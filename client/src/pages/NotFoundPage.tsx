import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

const Content = styled.div`
  max-width: 500px;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin-bottom: 1rem;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: var(--gray-800);
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--primary-gradient);
  color: var(--white);
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <Title>404</Title>
        <Subtitle>Page Not Found</Subtitle>
        <Description>
          The page you're looking for doesn't exist or has been moved.
        </Description>
        <HomeButton to="/">
          Go Home
        </HomeButton>
      </Content>
    </Container>
  );
};

export default NotFoundPage;