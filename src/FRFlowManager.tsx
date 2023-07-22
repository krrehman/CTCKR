import styled from 'styled-components';
import { FRRoutes } from './FRRoutes';
import { GlobalStyle } from './GlobalStyle';

const Wrapper = styled.div`
  overflow-x: hidden;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const FRFlowManager = () => {
  return (
    <Wrapper>
      <GlobalStyle />
      <FRRoutes />
    </Wrapper>
  );
};

export default FRFlowManager;
