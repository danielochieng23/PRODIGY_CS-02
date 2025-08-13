import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const EditAdPage: React.FC = () => {
  return (
    <Container>
      <Content>
        <h1>Edit Ad</h1>
        <p>Ad editing form will be implemented here.</p>
      </Content>
    </Container>
  );
};

export default EditAdPage;