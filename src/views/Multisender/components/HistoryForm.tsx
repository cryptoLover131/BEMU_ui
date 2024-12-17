import { useState } from "react";
import { multisenderABI } from "config/abi/multisender";
import styled from "styled-components";
import { Box, Flex, SearchInput, Text } from "components";
import { AppHeader } from "components/App";
import { getMultiSenderAddress } from "utils/addressHelpers";
import useEvents from "hooks/useEvents";
import { useActiveChainId } from "hooks/useActiveChainId";
import { FormContainer } from "./FormContainer";
import HistoryTable from "./HistoryTable";

const StyledFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
	justify-content: space-between;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

export default function HistoryForm() {
	const { chainId } = useActiveChainId()
	const [sender, setSender] = useState("")
	const [tag, setTag] = useState("")
	const { logs, isLoading } = useEvents(
		getMultiSenderAddress(chainId),
		multisenderABI,
		"Multisent",
		{
			sender,
		},
		225179664n,
	)
	
	const logs_ = isLoading ? [] : logs.filter((log) => tag !== "" ? log.args.tag === tag : true)

	const handleChangeQuery = (e: any) => {
		setTag(e.target.value)
	}

	const handleChangeSender = (e: any) => {
		setSender(e.target.value)
	}

	return (
		<Box p="10px 20px 20px" position="inherit">
      <AppHeader title='Multi-Send History' noConfig backTo='/multisend' />
			<FormContainer>
				<StyledFlex>
					<Box width={["100%", "100%", "49%"]} my="10px">
						<Text fontSize="12px" color="secondary">Search sender</Text>
						<SearchInput initialValue="" onChange={handleChangeSender} placeholder="Search Sender" />
					</Box>
					<Box width={["100%", "100%", "49%"]} my="10px">
					<Text fontSize="12px" color="secondary">Search tag</Text>
					<SearchInput initialValue="" onChange={handleChangeQuery} placeholder="Search Tag" />
				</Box>
				</StyledFlex>
			</FormContainer>
			{logs_.length > 0 && <HistoryTable data={logs_} />}
			{logs_.length === 0 && <Flex justifyContent="center">
				<Text>No history</Text>
			</Flex>}
		</Box>
	)
}