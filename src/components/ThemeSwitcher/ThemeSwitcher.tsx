import { memo } from "react";
import styled from 'styled-components'
import { SunIcon, MoonIcon } from "../Svg";
import { Flex } from "../Box";

export interface Props {
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
}

const StyledFlex = styled(Flex)`
  cursor: pointer;
`

const ThemeSwitcher: React.FC<React.PropsWithChildren<Props>> = ({ isDark, toggleTheme }) => (
  <StyledFlex alignItems="center" m="4px" justifyContent="center" justifyItems="center" >
    {isDark? <SunIcon color="gold" width="24px" onClick={() => toggleTheme(isDark)} /> : <MoonIcon fill="spec" width="24px" onClick={() => toggleTheme(!isDark)} />}
  </StyledFlex>
);

export default memo(ThemeSwitcher, (prev, next) => prev.isDark === next.isDark);
