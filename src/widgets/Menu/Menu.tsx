import throttle from "lodash/throttle";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import useIsMounted from "hooks/useIsMounted";
import { AtomBox } from "components/AtomBox";
import { Box } from "components/Box";
import Flex from "components/Box/Flex";
import CakePrice from "components/CakePrice/CakePrice";
import TopMenuItems from "components/MenuItems/TopMenuItems";
import { useMatchBreakpoints } from "contexts";
import Logo from "./components/Logo";
import { MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE, SIDEBAR_WIDTH_FULL, SIDEBAR_WIDTH_REDUCED } from "./config";
import { MenuContext } from "./context";
import { NavProps } from "./types";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${MENU_HEIGHT}px;
  // background: ${({ theme }) => theme.colors.background};
  transform: translate3d(0, 0, 0);

  padding-left: 24px;
  padding-right: 24px;
`;

const FixedContainer = styled("div").withConfig({
  shouldForwardProp: (props) => !["showMenu"].includes(props),
})<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: ${({ height }) => `${height}px`};
  width: 100%;
  z-index: 20;
`;

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
  max-width: 100vw;
  justify-content: center;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  // transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    // margin-left: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL + 10 : SIDEBAR_WIDTH_REDUCED}px`};
    max-width: ${({ isPushed }) => `calc(100% - ${isPushed ? SIDEBAR_WIDTH_FULL + 10 : SIDEBAR_WIDTH_REDUCED}px)`};
  }
`;

const Menu: React.FC<React.PropsWithChildren<NavProps>> = ({
  linkComponent = "a",
  banner,
  rightSide,
  cakePriceUsd,
  links,
  mobileLinks,
  activeItem,
  activeSubItem,
  children,
  chainId,
}) => {
  const { isMobile } = useMatchBreakpoints();
  const isMounted = useIsMounted();
  const [isPushed, ] = useState(!isMobile);
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);

  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;

  const totalTopMenuHeight = isMounted && banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(false);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight]);

  // Find the home link if provided
  const providerValue = useMemo(() => ({ linkComponent }), [linkComponent]);
  return (
    <MenuContext.Provider value={providerValue}>
      <AtomBox
        asChild
        minHeight={{
          xs: "auto",
          md: "100vh",
        }}
      >
        <Wrapper>
          <FixedContainer showMenu={showMenu} height={totalTopMenuHeight}>
            {banner && isMounted && <TopBannerContainer height={topBannerHeight}>{banner}</TopBannerContainer>}
            <StyledNav>
              <Flex>
                <Logo
                  href="/"
                />
                <AtomBox display={{ xs: "none", md: "block" }}>
                  <TopMenuItems items={links} activeItem={activeItem} activeSubItem={activeSubItem} ml="24px" />
                </AtomBox>
                <AtomBox display={{ xs: "block", md: "none" }}>
                  <TopMenuItems items={mobileLinks} activeItem={activeItem} activeSubItem={activeSubItem} ml="24px" />
                </AtomBox>
              </Flex>
              <Flex alignItems="center" height="100%">
                {/* <AtomBox mr="20px" display={{ xs: "none", lg: "block" }}>
                  <CakePrice chainId={chainId} showSkeleton={false} cakePriceUsd={cakePriceUsd} />
                </AtomBox> */}
                {rightSide}
              </Flex>
            </StyledNav>
          </FixedContainer>
          <BodyWrapper mt={`${totalTopMenuHeight + 8}px`}>
            {/* <Panel
              isPushed={isPushed}
              isMobile={isMobile}
              chainId={chainId}
              showMenu={showMenu}
              isDark={isDark}
              toggleTheme={toggleTheme}
              cakePriceUsd={cakePriceUsd}
              pushNav={setIsPushed}
              links={links}
              activeItem={activeItem}
              activeSubItem={activeSubItem}
            /> */}
            <Inner isPushed={isPushed} showMenu={showMenu}>
              {children}
            </Inner>
            {/* <MobileOnlyOverlay show={isPushed} onClick={() => setIsPushed(false)} role="presentation" /> */}
          </BodyWrapper>
        </Wrapper>
      </AtomBox>
    </MenuContext.Provider>
  );
};

export default Menu;
