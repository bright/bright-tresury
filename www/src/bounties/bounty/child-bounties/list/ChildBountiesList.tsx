import React from 'react'
import Grid from '../../../../components/grid/Grid'
import { BountyDto } from '../../../bounties.dto'
import { ChildBountyDto } from '../child-bounties.dto'
import ChildBountyCard from './ChildBountyCard'

interface OwnProps {
    bounty: BountyDto
    childBounties: ChildBountyDto[]
}

export type ChildBountyListProps = OwnProps

const ChildBountiesList = ({ bounty, childBounties }: ChildBountyListProps) => {
    const renderCard = (childBounty: ChildBountyDto) => <ChildBountyCard bounty={bounty} childBounty={childBounty} />

    return <Grid items={childBounties?.sort((a, b) => b.blockchainIndex - a.blockchainIndex)} renderItem={renderCard} />
}

export default ChildBountiesList
