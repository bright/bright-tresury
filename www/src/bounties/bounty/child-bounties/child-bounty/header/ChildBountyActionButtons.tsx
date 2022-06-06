import React from 'react'
import { ChildBountyDto } from '../../child-bounties.dto'
import ActionButtons, { ActionButtonsProps } from '../../../../../components/header/details/ActionButtons'
import { BountyDto } from '../../../../bounties.dto'
import { useChildBounty } from '../../useChildBounty'
import ChildBountyAcceptCuratorButton from './curator-actions/accept/ChildBountyAcceptCuratorButton'
import ChildBountyUnassignCuratorButton from './curator-actions/unassign/ChildBountyUnassignCuratorButton'

interface OwnProps {
    bounty: BountyDto
    childBounty: ChildBountyDto
}

export type CuratorActionButtonsProps = OwnProps & ActionButtonsProps

const ChildBountyActionButtons = ({ bounty, childBounty, ...props }: CuratorActionButtonsProps) => {
    const { canAcceptCurator, canUnassignCurator, canClaimPayout } = useChildBounty(bounty, childBounty)
    return (
        <ActionButtons {...props}>
            {canAcceptCurator ? <ChildBountyAcceptCuratorButton childBounty={childBounty} /> : null}
            {canUnassignCurator ? <ChildBountyUnassignCuratorButton bounty={bounty} childBounty={childBounty} /> : null}
            {/*TODO: TREAS-435 { canClaimPayout ? <ChildBountyClaimPayoutButton /> : null}*/}
        </ActionButtons>
    )
}

export default ChildBountyActionButtons
