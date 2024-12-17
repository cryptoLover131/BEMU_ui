/* eslint-disable @typescript-eslint/no-var-requires */
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import { withAxiom } from 'next-axiom'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const config = {
  compiler: {
    styledComponents: true,
  },
  // experimental: {
  //   scrollRestoration: true,
  //   outputFileTracingRoot: path.join(__dirname, '../../'),
  //   outputFileTracingExcludes: {
  //     '*': ['**@swc+core*', '**/@esbuild**'],
  //   },
  //   transpilePackages: [
  //     '@wagmi',
  //     'wagmi',
  //     '@ledgerhq'
  //   ],
  // },
  staticPageGenerationTimeout: 1000,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  async rewrites() {
    return [
      {
        source: '/info/token/:address',
        destination: '/info/tokens/:address',
      },
      {
        source: '/info/pool/:address',
        destination: '/info/pools/:address',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/logo.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
      {
        source: '/images/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/send',
        destination: '/swap',
        permanent: true,
      },
      {
        source: '/swap/:outputCurrency',
        destination: '/swap?outputCurrency=:outputCurrency',
        permanent: true,
      },
      {
        source: '/create/:currency*',
        destination: '/add/:currency*',
        permanent: true,
      },
      {
        source: '/farms/archived',
        destination: '/farms/history',
        permanent: true,
      },
      {
        source: '/staking',
        destination: '/pools',
        permanent: true,
      },
      {
        source: '/info/pools',
        destination: '/info/pairs',
        permanent: true,
      },
      {
        source: '/info/pools/:address',
        destination: '/info/pairs/:address',
        permanent: true,
      },
    ]
  },
}

// export default withBundleAnalyzer(withVanillaExtract(withSentryConfig(withAxiom(config), sentryWebpackPluginOptions)))
export default withVanillaExtract(config)
