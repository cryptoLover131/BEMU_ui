import { ReactElement } from "react";
import styled from "styled-components";
import { ErrorIcon, Text, Flex, Button } from "components";
import { AutoColumn } from "components/Column";

const Wrapper = styled.div`
  width: 100%;
`;

export function TransactionErrorContent({
  message,
  onDismiss,
}: {
  message: ReactElement | string;
  onDismiss?: () => void;
}) {
  return (
    <Wrapper>
      <AutoColumn justify="center">
        <ErrorIcon color="failure" width="64px" />
        <Text color="failure" style={{ textAlign: "center", width: "85%", wordBreak: "break-word" }}>
          {message}
        </Text>
      </AutoColumn>

      {onDismiss ? (
        <Flex justifyContent="center" pt="24px">
          <Button onClick={onDismiss} scale="md" variant="tertiary">Dismiss</Button>
        </Flex>
      ) : null}
    </Wrapper>
  );
}
