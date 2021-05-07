import React from 'react'
import { ProposalCard } from './ProposalCard'
import { ProposalDto } from '../proposals.dto'
import { Grid } from '../../components/grid/Grid'

interface ProposalsListProps {
    proposals: ProposalDto[]
}

export const ProposalsList = ({ proposals }: ProposalsListProps) => {
    const renderCard = (proposal: ProposalDto) => <ProposalCard proposal={proposal} />

    return <Grid items={proposals} renderItem={renderCard} />
}
