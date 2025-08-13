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

const AdDetailPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <h1>Ad Details</h1>
        <p>Ad detail view will be implemented here.</p>
      </Content>
    </Container>
  );
};

export default AdDetailPage;