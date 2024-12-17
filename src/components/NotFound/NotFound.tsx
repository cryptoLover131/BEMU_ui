import styled from "styled-components";
import { JSXElementConstructor, ReactNode, createElement } from "react";
import { Text } from "../Text";
import { Button } from "../Button";

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  justify-content: center;
`;

const NotFound = ({
  statusCode = 404,
  children,
  LinkComp,
}: {
  LinkComp: JSXElementConstructor<any>;
  statusCode?: number;
  children: ReactNode;
}) => {
  const linkElement = createElement(
    LinkComp,
    {
      href: "/",
      passHref: true,
    },
    <Button scale="sm" variant="secondary">Back Swap</Button>
  );

  return (
    <>
      {children}
      <StyledNotFound>
        <Text fontSize="56px">{statusCode}</Text>
        <Text mb="16px">Oops, page not found.</Text>
        {linkElement}
      </StyledNotFound>
    </>
  );
};

export default NotFound;
