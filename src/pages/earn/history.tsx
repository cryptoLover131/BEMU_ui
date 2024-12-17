// import { CHAIN_IDS } from 'utils/wagmi'
// import Farms from 'views/Farms'

// const FarmsPage = () => <Farms />

// FarmsPage.chains = CHAIN_IDS

// export default FarmsPage

import { NotFound } from 'components/NotFound'
import { NextSeo } from 'next-seo'
import Link from 'next/link'

const NotFoundPage = () => (
  <NotFound LinkComp={Link}>
    <NextSeo title="404" />
  </NotFound>
)

NotFoundPage.chains = []

export default NotFoundPage