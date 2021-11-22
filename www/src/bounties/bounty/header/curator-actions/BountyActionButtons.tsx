import React from 'react'
import ActionButtons, { ActionButtonsProps } from '../../../../components/header/details/ActionButtons'
import { BountyDto } from '../../../bounties.dto'
import { useBounty } from '../../useBounty'
import CuratorAcceptButton from './accept/CuratorAcceptButton'
import ClaimPayoutButton from './claim/ClaimPayoutButton'
import CuratorRejectButton from './reject/CuratorRejectButton'

interface OwnProps {
    bounty: BountyDto
}

export type CuratorActionButtonsProps = OwnProps & ActionButtonsProps

const BountyActionButtons = ({ bounty, ...props }: CuratorActionButtonsProps) => {
    const { canReject, canAccept, canClaimPayout } = useBounty(bounty)
    if (!canAccept && !canReject && !canClaimPayout) {
        return null
    }

    return (
        <ActionButtons {...props}>
            {canReject ? <CuratorRejectButton bounty={bounty} /> : null}
            {canAccept ? <CuratorAcceptButton bounty={bounty} /> : null}
            {canClaimPayout ? <ClaimPayoutButton bounty={bounty} /> : null}
        </ActionButtons>
    )
}

export default BountyActionButtons
