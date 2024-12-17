import { ArrowBackIcon, ArrowForwardIcon, Box, Flex, Link, Text } from "components";
import { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { CurrencyLogo } from "components/Logo";
import useNativeCurrency from "hooks/useNativeCurrency";
import { useCurrency } from "hooks/Tokens";
import { zeroAddress } from "viem";
import { getBlockExploreLink } from "utils";
import { useActiveChainId } from "hooks/useActiveChainId";


const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 0.5em;
  align-items: center;

  padding: 0 8px;

  grid-template-columns: 1fr 2fr 3fr 3fr 4fr;

  @media screen and (max-width: 576px) {
    grid-template-columns: 1fr 2fr 4fr;
    & :nth-child(2) {
      display: none;
    }
    & :nth-child(3) {
      display: none;
    }
  }
`

const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  gap: 8px;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 8px;
  }
`

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

const DataRow: React.FC<React.PropsWithChildren<{ data: any; index: number }>> = ({ data, index }) => {
  const native = useNativeCurrency()
  const { chainId } = useActiveChainId()
  const token = useCurrency(data.args.token)
  const currency = data.args.token === zeroAddress ? native : token
  const accountEllipsis = data.args.sender ? `${data.args.sender.substring(0, 6)}...${data.args.sender.substring(data.args.sender.length - 4)}` : null;
  const hashEllipsis = data.transactionHash ? `${data.transactionHash.substring(0, 6)}...${data.transactionHash.substring(data.transactionHash.length - 4)}` : null;

  return (
    <ResponsiveGrid>
      <Flex>
        <Text small>{index + 1}</Text>
      </Flex>
      <Flex alignItems="center">
        <CurrencyLogo size="18px" currency={currency} />
        <Box display={["none", "none", "block"]}>
          <Text small ml="4px" pt="2px">{currency?.symbol ?? ""}</Text>
        </Box>
      </Flex>
      <Link href={getBlockExploreLink(data.args.sender, 'address', chainId)} target="_blank">
        <Text small>{accountEllipsis}</Text>
      </Link>
      <Link href={getBlockExploreLink(data.transactionHash, 'transaction', chainId)} target="_blank">
        <Text small>{hashEllipsis}</Text>
      </Link>
      <Text small>{data.args.tag}</Text>
    </ResponsiveGrid>
  )
}

const MAX_ITEMS = 10

const HistoryTable: React.FC<
  React.PropsWithChildren<{
    data: any[]
    maxItems?: number
  }>
> = ({ data, maxItems = MAX_ITEMS }) => {
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    let extraPages = 1
    if (data) {
      if (data.length % maxItems === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(data.length / maxItems) + extraPages)
    }
  }, [maxItems, data])

  const sortedData = useMemo(() => {
    return data
      ? data.slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [data, maxItems, page])

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold>
          #
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          Token
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          Sender
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          Transaction
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          Tag
        </Text>
      </ResponsiveGrid>

      {sortedData.map((row, i) => {
        if (row) {
          return (
            <Fragment key={row.transactionHash}>
              <DataRow data={row} index={(page - 1) * MAX_ITEMS + i} />
            </Fragment>
          )
        }
        return null
      })}
      <PageButtons>
        <Arrow
          onClick={() => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
        </Arrow>
        <Text>{`Page ${page} of ${maxPage}`}</Text>
        <Arrow
          onClick={() => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
        </Arrow>
      </PageButtons>
    </TableWrapper>
  )
}

export default HistoryTable