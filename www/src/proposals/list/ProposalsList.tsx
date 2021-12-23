import React from 'react'
import ProposalCard from './ProposalCard'
import { ProposalDto } from '../proposals.dto'
import Grid from '../../components/grid/Grid'

interface OwnProps {
    proposals: ProposalDto[]
}

export type ProposalsListProps = OwnProps

const ProposalsList = ({ proposals }: ProposalsListProps) => {
    const renderCard = (proposal: ProposalDto) => <ProposalCard proposal={proposal}/>
    return <Grid items={proposals.sort((a, b) => b.proposalIndex - a.proposalIndex)} renderItem={renderCard} />
}

export default ProposalsList
