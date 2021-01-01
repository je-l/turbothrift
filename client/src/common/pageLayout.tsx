import styled from "styled-components";

/**
 * Primary page column which leaves empty space on wide screens to sides.
 */
export const MainColumn = styled.div`
  flex: 1;

  max-width: 800px;
  margin-top: 100px;
`;

export const MainRow = styled.div`
  display: flex;
  justify-content: center;

  margin: 0 10px;
`;
