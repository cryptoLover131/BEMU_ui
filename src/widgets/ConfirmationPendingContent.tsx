import styled from "styled-components";
import { AutoColumn, ColumnCenter } from "components/Column";
import { Spinner, Text } from "components";

const Wrapper = styled.div`
  width: 100%;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`;

export function ConfirmationPendingContent({ pendingText }: { pendingText?: string }) {
  return (
    <Wrapper>
      <ConfirmedIcon>
        <Spinner />
      </ConfirmedIcon>
      <AutoColumn gap="12px" justify="center">
        {pendingText ? (
          <>
            <Text fontSize="20px">Waiting For Confirmation</Text>
            <AutoColumn gap="12px" justify="center">
              <Text small textAlign="center">
                {pendingText}
              </Text>
            </AutoColumn>
          </>
        ) : null}
        <Text small color="textSubtle" textAlign="center">
          Proceed in your wallet
        </Text>
      </AutoColumn>
    </Wrapper>
  );
}
