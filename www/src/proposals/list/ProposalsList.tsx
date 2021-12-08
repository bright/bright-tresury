import React from 'react'
import ProposalCard from './ProposalCard'
import { ProposalDto } from '../proposals.dto'
import Grid from '../../components/grid/Grid'

interface OwnProps {
    proposals: ProposalDto[]
    disableCards?: boolean
    showStatus?: boolean
}

export type ProposalsListProps = OwnProps

const ProposalsList = ({ proposals, disableCards = false, showStatus = true }: ProposalsListProps) => {
    const renderCard = (proposal: ProposalDto) => <ProposalCard proposal={proposal} disable={disableCards} showStatus={showStatus}/>
    return <Grid items={proposals.sort((a, b) => b.proposalIndex - a.proposalIndex)} renderItem={renderCard} />
}

export default ProposalsList
