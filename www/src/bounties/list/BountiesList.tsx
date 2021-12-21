import React from 'react'
import Grid from '../../components/grid/Grid'
import { BountyDto } from '../bounties.dto'
import BountyCard from './BountyCard'

interface OwnProps {
    bounties?: BountyDto[]
}

export type BountyListProps = OwnProps

const BountiesList = ({ bounties }: BountyListProps) => {
    const renderCard = (bounty: BountyDto) => <BountyCard bounty={bounty} />

    return <Grid items={bounties?.sort((a, b) => b.blockchainIndex - a.blockchainIndex)} renderItem={renderCard} />
}

export default BountiesList
