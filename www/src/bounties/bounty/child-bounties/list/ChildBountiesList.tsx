import React from 'react'
import Grid from '../../../../components/grid/Grid'
import { BountyDto } from '../../../bounties.dto'
import { ChildBountyDto, ChildBountyStatus } from '../child-bounties.dto'
import ChildBountyCard from './ChildBountyCard'

interface OwnProps {
    bounty: BountyDto
    childBounties: ChildBountyDto[]
}

export type ChildBountyListProps = OwnProps

const ChildBountiesList = ({ bounty, childBounties }: ChildBountyListProps) => {
    const renderCard = (childBounty: ChildBountyDto) => <ChildBountyCard bounty={bounty} childBounty={childBounty} />
    const sort = (a: ChildBountyDto, b: ChildBountyDto) => {
        // sorting onChain childBounties first
        const onChainStatuses = [
            ChildBountyStatus.Added,
            ChildBountyStatus.CuratorProposed,
            ChildBountyStatus.Active,
            ChildBountyStatus.PendingPayout,
            ChildBountyStatus.Awarded,
        ]
        const aIsOnChain = onChainStatuses.includes(a.status)
        const bIsOnChain = onChainStatuses.includes(b.status)
        if (aIsOnChain && !bIsOnChain) return -1
        if (bIsOnChain && !aIsOnChain) return 1
        return b.blockchainIndex - a.blockchainIndex
    }
    return <Grid items={childBounties?.sort(sort)} renderItem={renderCard} />
}

export default ChildBountiesList
