import React from "react";
import styled from "styled-components";
import { CogIcon } from "components/Svg";
import IconButton from "components/Button/IconButton";
import CakePrice from "components/CakePrice/CakePrice";
import { PanelProps, PushedProps } from "../types";
import SocialLinks from "./SocialLinks";

interface Props extends PanelProps, PushedProps {}

const Container = styled.div`
  flex: none;
  padding: 8px 4px;
`;

const SocialEntry = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  margin-bottom: 20px;
`;

const PanelFooter: React.FC<Props> = ({
  isPushed,
  pushNav,
  cakePriceUsd,
  chainId,
}) => {
  if (!isPushed) {
    return (
      <Container>
        <IconButton variant="text" onClick={() => pushNav(true)}>
          <CogIcon />
        </IconButton>
      </Container>
    );
  }

  return (
    <Container>
      <SocialEntry>
        <CakePrice cakePriceUsd={cakePriceUsd} chainId={chainId} />
        <SocialLinks />
      </SocialEntry>
    </Container>
  );
};

export default PanelFooter;
