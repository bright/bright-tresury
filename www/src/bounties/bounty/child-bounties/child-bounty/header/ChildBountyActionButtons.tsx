import React from 'react'
import { ChildBountyDto } from '../../child-bounties.dto'
import ActionButtons, { ActionButtonsProps } from '../../../../../components/header/details/ActionButtons'
import { BountyDto } from '../../../../bounties.dto'
import { useChildBounty } from '../../useChildBounty'
import ChildBountyAcceptCuratorButton from './curator-actions/accept/ChildBountyAcceptCuratorButton'
import ChildBountyUnassignCuratorButton from './curator-actions/unassign/ChildBountyUnassignCuratorButton'
import { useNetworks } from '../../../../../networks/useNetworks'
import { useGetChildBounty } from '../../child-bounties.api'
import ChildBountyClaimButton from './curator-actions/claim/ChildBountyClaimButton'
import ChildBountyEditButton from './ChildBountyEditButton'
import ChildBountyPolkassemblyShareButton from './curator-actions/polkassembly-share/ChildBountyPolkassemblyShareButton'

interface OwnProps {
    bounty: BountyDto
    childBounty: ChildBountyDto
}

export type CuratorActionButtonsProps = OwnProps & ActionButtonsProps

const ChildBountyActionButtons = ({ bounty, childBounty, ...props }: CuratorActionButtonsProps) => {
    const { network } = useNetworks()
    const {
        canAcceptCurator,
        canUnassignCurator,
        canClaimPayout,
        isCuratorProposed,
        canEdit,
        canSharePolkassembly,
    } = useChildBounty(bounty, childBounty)
    const { refetch } = useGetChildBounty({
        bountyIndex: childBounty.parentBountyBlockchainIndex.toString(),
        childBountyIndex: childBounty.blockchainIndex.toString(),
        network: network.id,
    })

    return (
        <ActionButtons {...props}>
            {canSharePolkassembly ? (
                <ChildBountyPolkassemblyShareButton bounty={bounty} childBounty={childBounty} />
            ) : null}
            {canEdit ? <ChildBountyEditButton childBounty={childBounty} bounty={bounty} /> : null}
            {canAcceptCurator && isCuratorProposed ? (
                <ChildBountyAcceptCuratorButton childBounty={childBounty} onSuccess={refetch} />
            ) : null}
            {canUnassignCurator && isCuratorProposed ? (
                <ChildBountyUnassignCuratorButton bounty={bounty} childBounty={childBounty} onSuccess={refetch} />
            ) : null}
            {canClaimPayout ? <ChildBountyClaimButton childBounty={childBounty} /> : null}
        </ActionButtons>
    )
}

export default ChildBountyActionButtons
