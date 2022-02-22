import React from 'react'
import ActionButtons, { ActionButtonsProps } from '../../../../components/header/details/ActionButtons'
import { BountyDto, BountyStatus } from '../../../bounties.dto'
import { useBounty } from '../../useBounty'
import CuratorAcceptButton from './accept/CuratorAcceptButton'
import ClaimPayoutButton from './claim/ClaimPayoutButton'
import BountyPolkassemblyShareButton from './polkassembly-share/BountyPolkassemblyShareButton'
import CuratorRejectButton from './reject/CuratorRejectButton'
import BountyEditButton from './BountyEditButton'

interface OwnProps {
    bounty: BountyDto
}

export type CuratorActionButtonsProps = OwnProps & ActionButtonsProps

const BountyActionButtons = ({ bounty, ...props }: CuratorActionButtonsProps) => {
    const { canReject, canAccept, canClaimPayout, canEdit } = useBounty(bounty)

    if (!canAccept && !canReject && !canClaimPayout && !canEdit) {
        return null
    }

    return (
        <ActionButtons {...props}>
            {canEdit ? <BountyEditButton bounty={bounty} /> : null}
            {canEdit ? <BountyPolkassemblyShareButton bounty={bounty} /> : null}
            {canReject && bounty.status === BountyStatus.CuratorProposed ? (
                <CuratorRejectButton bounty={bounty} />
            ) : null}
            {canAccept ? <CuratorAcceptButton bounty={bounty} /> : null}
            {canClaimPayout ? <ClaimPayoutButton bounty={bounty} /> : null}
        </ActionButtons>
    )
}

export default BountyActionButtons
