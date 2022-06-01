import React from 'react'
import { ChildBountyDto } from '../../child-bounties.dto'
import ActionButtons, { ActionButtonsProps } from '../../../../../components/header/details/ActionButtons'
import { BountyDto, BountyStatus } from '../../../../bounties.dto'
import CuratorRejectButton from '../../../header/curator-actions/reject/CuratorRejectButton'
import CuratorAcceptButton from '../../../header/curator-actions/accept/CuratorAcceptButton'
import ClaimPayoutButton from '../../../header/curator-actions/claim/ClaimPayoutButton'
import { useChildBounty } from '../../useChildBounty'

interface OwnProps {
    bounty: BountyDto
    childBounty: ChildBountyDto
}

export type CuratorActionButtonsProps = OwnProps & ActionButtonsProps

const ChildBountyActionButtons = ({ bounty, childBounty, ...props }: CuratorActionButtonsProps) => {
    //TODO: Implement when adding accept curator and reject curator
    const { canAcceptCurator, canUnassignCurator, canClaimPayout } = useChildBounty(bounty, childBounty)
    return (
        <ActionButtons {...props}>
            {/*TODO:  TREAS-430 { canAcceptCurator ? <ChildBountyAcceptCuratorButton /> : null}*/}
            {/*TODO: TREAS-431 TREAS-432 { canUnassignCurator ? <ChildBountyUnassignCuratorButton  /> : null}*/}
            {/*TODO: TREAS-435 { canClaimPayout ? <ChildBountyClaimPayoutButton /> : null}*/}
        </ActionButtons>
    )
}

export default ChildBountyActionButtons
