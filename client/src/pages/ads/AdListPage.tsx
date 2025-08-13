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

const AdListPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <h1>Browse Ads</h1>
        <p>Ad listing and filtering will be implemented here.</p>
      </Content>
    </Container>
  );
};

export default AdListPage;