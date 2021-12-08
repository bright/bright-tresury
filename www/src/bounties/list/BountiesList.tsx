import React from 'react'
import Grid from '../../components/grid/Grid'
import { BountyDto } from '../bounties.dto'
import BountyCard from './BountyCard'

interface OwnProps {
    bounties?: BountyDto[]
    disableCards?: boolean
    showStatus?: boolean
}

export type BountyListProps = OwnProps

const BountiesList = ({ bounties, disableCards = false, showStatus = true }: BountyListProps) => {
    const renderCard = (bounty: BountyDto) => <BountyCard bounty={bounty} disable={disableCards} showStatus={showStatus}/>

    return <Grid items={bounties?.sort((a, b) => b.blockchainIndex - a.blockchainIndex)} renderItem={renderCard} />
}

export default BountiesList
