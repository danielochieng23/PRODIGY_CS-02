import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Content = styled.div`
  text-align: center;
  max-width: 500px;
`;

const RegisterPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <h1>Register Page</h1>
        <p>Registration form will be implemented here.</p>
      </Content>
    </Container>
  );
};

export default RegisterPage;