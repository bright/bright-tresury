import React from 'react'
import { ChildBountyDto, ChildBountyStatus } from '../../child-bounties.dto'
import ActionButtons, { ActionButtonsProps } from '../../../../../components/header/details/ActionButtons'
import { useChildBounty } from '../../useChildBounty'

interface OwnProps {
    childBounty: ChildBountyDto
}

export type CuratorActionButtonsProps = OwnProps & ActionButtonsProps

const ChildBountyActionButtons = ({ childBounty, ...props }: CuratorActionButtonsProps) => {
    return null
    /*
    const { canAccept, canReject, canClaimPayout } = useChildBounty(childBounty)
    if (!canAccept && !canReject && !canClaimPayout) {
        return null
    }

    return (
        <ActionButtons {...props}>
            {canReject && childBounty.status === ChildBountyStatus.CuratorProposed ? (
                <CuratorRejectButton bounty={bounty} />
            ) : null}
            {canAccept ? <CuratorAcceptButton bounty={bounty} /> : null}
        </ActionButtons>
    )

 */
}

export default ChildBountyActionButtons
