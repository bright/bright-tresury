import React from 'react'
import { ChildBountyDto } from '../../child-bounties.dto'
import ActionButtons, { ActionButtonsProps } from '../../../../../components/header/details/ActionButtons'
import { BountyDto } from '../../../../bounties.dto'
import { useChildBounty } from '../../useChildBounty'
import ChildBountyAcceptCuratorButton from './curator-actions/accept/ChildBountyAcceptCuratorButton'
import ChildBountyUnassignCuratorButton from './curator-actions/unassign/ChildBountyUnassignCuratorButton'
import { useNetworks } from '../../../../../networks/useNetworks'
import { useGetChildBounty } from '../../child-bounties.api'

interface OwnProps {
    bounty: BountyDto
    childBounty: ChildBountyDto
}

export type CuratorActionButtonsProps = OwnProps & ActionButtonsProps

const ChildBountyActionButtons = ({ bounty, childBounty, ...props }: CuratorActionButtonsProps) => {
    const { network } = useNetworks()
    const { canAcceptCurator, canUnassignCurator, canClaimPayout } = useChildBounty(bounty, childBounty)
    const { refetch } = useGetChildBounty({
        bountyIndex: childBounty.parentBountyBlockchainIndex.toString(),
        childBountyIndex: childBounty.blockchainIndex.toString(),
        network: network.id,
    })

    return (
        <ActionButtons {...props}>
            {canAcceptCurator ? <ChildBountyAcceptCuratorButton childBounty={childBounty} onSuccess={refetch} /> : null}
            {canUnassignCurator ? (
                <ChildBountyUnassignCuratorButton bounty={bounty} childBounty={childBounty} onSuccess={refetch} />
            ) : null}
            {/*TODO: TREAS-435 { canClaimPayout ? <ChildBountyClaimPayoutButton /> : null}*/}
        </ActionButtons>
    )
}

export default ChildBountyActionButtons
