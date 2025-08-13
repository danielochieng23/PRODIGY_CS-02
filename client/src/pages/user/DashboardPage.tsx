import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const DashboardPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <h1>Dashboard</h1>
        <p>User dashboard with ads management will be implemented here.</p>
      </Content>
    </Container>
  );
};

export default DashboardPage;