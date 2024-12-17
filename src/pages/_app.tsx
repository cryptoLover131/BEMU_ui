import ResetCSS from 'ResetCSS'
import { ToastListener } from 'contexts'
import BigNumber from 'bignumber.js'
import { ScrollToTopButtonV2 } from 'components/ScrollToTopButton'
import { PageMeta } from 'components/Layout/Page'
import { useAccountEventListener } from 'hooks/useAccountEventListener'
import useThemeCookie from 'hooks/useThemeCookie'
import useUserAgent from 'hooks/useUserAgent'
import { NextPage } from 'next'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { Fragment } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, useStore } from 'state'
import { usePollBlockNumber } from 'state/block/hooks'
import { Updaters } from '..'
import { SEO } from '../../next-seo.config'
import Providers from '../Providers'
import Menu from '../components/Menu'
import GlobalStyle from '../Global'
import LandingPage from '../components/LandingPage'
// Import the styles for the landing page
import '../styles/normalize.css'
import '../styles/webflow.css'
import '../styles/landing.css'

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function GlobalHooks() {
  usePollBlockNumber()
  useUserAgent()
  useAccountEventListener()
  useThemeCookie()
  return null
}

function MPGlobalHooks() {
  usePollBlockNumber()
  useUserAgent()
  useAccountEventListener()
  return null
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>
  pure?: true
  mp?: boolean
  chains?: number[]
  isShowScrollToTopButton?: true
  screen?: true
  Meta?: React.FC<React.PropsWithChildren<unknown>>
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp(props: AppProps<{ initialReduxState: any; dehydratedState: any }>) {
  const { pageProps, Component } = props
  const store = useStore(pageProps.initialReduxState)

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="description" content="" />
        <meta name="theme-color" content="#1FC7D4" />
        {(Component as NextPageWithLayout).mp && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js" id="mp-webview" />
        )}
      </Head>
      <DefaultSeo {...SEO} />
      <Providers store={store} dehydratedState={pageProps.dehydratedState}>
        <PageMeta />
        {(Component as NextPageWithLayout).Meta && (
          // @ts-ignore
          <Component.Meta {...pageProps} />
        )}
        {(Component as NextPageWithLayout).mp ? <MPGlobalHooks /> : <GlobalHooks />}
        <ResetCSS />
        <GlobalStyle />
        <PersistGate loading={null} persistor={persistor}>
          <Updaters />
          <App {...props} />
        </PersistGate>
      </Providers>
      {/* Google Tag Manager */}
      <Script
        strategy="afterInteractive"
        id="google-tag"
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PXLD3XW');
        `,
        }}
      />
      {/* StickyShowcase Script for Landing Page */}
      <Script
        src="https://uploads-ssl.webflow.com/5cae580b70e3e817d963cb90/5da7c8c4805cc12fd2577ed2_index-v2.txt"
        strategy="beforeInteractive"
      />
    </>
  )
}

const ProductionErrorBoundary = Fragment

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  if (Component.pure) {
    return <Component {...pageProps} />
  }

  // Use the layout defined at the page level, if available
  const Layout = Component.Layout || Fragment
  const ShowMenu = Component.mp ? Fragment : Menu
  const isShowScrollToTopButton = Component.isShowScrollToTopButton || true

  return (
    <ProductionErrorBoundary>
      <LandingPage />
      <ShowMenu>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ShowMenu>
      <ToastListener />
      {isShowScrollToTopButton && <ScrollToTopButtonV2 />}
    </ProductionErrorBoundary>
  )
}

export default MyApp
