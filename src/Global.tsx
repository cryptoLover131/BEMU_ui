import { AppTheme } from 'theme'
import { createGlobalStyle } from 'styled-components'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends AppTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Basel', sans-serif;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    overflow-x: hidden;

    img {
      height: auto;
      max-width: 100%;
    }
  }

  #__next {
    position: relative;
  }

  #portal-root {
    position: relative;
  }

  @font-face {
    font-family: "Basel";
    font-style: normal;
    font-weight: 485;
    src: url("/fonts/Basel-Grotesk-Book.woff2") format("woff2");
`

export default GlobalStyle
