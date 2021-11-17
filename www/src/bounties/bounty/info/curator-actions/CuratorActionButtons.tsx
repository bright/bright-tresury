import React from 'react'
import ActionButtons, { ActionButtonsProps } from '../../../../components/header/details/ActionButtons'
import { BountyDto } from '../../../bounties.dto'
import { useBounty } from '../../useBounty'
import CuratorAcceptButton from './CuratorAcceptButton'
import CuratorRejectButton from './CuratorRejectButton'

interface OwnProps {
    bounty: BountyDto
}

export type CuratorActionButtonsProps = OwnProps & ActionButtonsProps

const CuratorActionButtons = ({ bounty, ...props }: CuratorActionButtonsProps) => {
    const { canReject, canAccept } = useBounty(bounty)

    if (!canAccept && !canReject) {
        return null
    }

    return (
        <ActionButtons {...props}>
            {canReject ? <CuratorRejectButton bounty={bounty} /> : null}
            {canAccept ? <CuratorAcceptButton bounty={bounty} /> : null}
        </ActionButtons>
    )
}

export default CuratorActionButtons
