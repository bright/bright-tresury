import React from 'react'
import { ChildBountyDto } from '../../child-bounties.dto'
import { ClassNameProps } from '../../../../../components/props/className.props'
import { useMenu } from '../../../../../hook/useMenu'
import OptionsButton from '../../../../../components/header/details/OptionsButton'
import { BountyDto } from '../../../../bounties.dto'
import AwardChildBountyMenuItem from './curator-actions/award/AwardChildBountyMenuItem'
import AssignChildBountyMenuItem from '../assign-curator/AssignChildBountyMenuItem'
import CloseChildBountyMenuItem from '../close-child-bounty/CloseChildBountyMenuItem'
import RejectChildBountyCuratorMenuItem from './curator-actions/unassign/RejectChildBountyCuratorMenuItem'

interface OwnProps {
    childBounty: ChildBountyDto
    bounty: BountyDto
}

export type ChildBountyOptionsButtonProps = OwnProps & ClassNameProps

const ChildBountyOptionsButton = ({ className, childBounty, bounty }: ChildBountyOptionsButtonProps) => {
    const { anchorEl, open, handleClose, handleOpen } = useMenu()
    return (
        <>
            <OptionsButton
                anchorEl={anchorEl}
                open={open}
                handleClose={handleClose}
                handleOpen={handleOpen}
                className={className}
            >
                <AssignChildBountyMenuItem bounty={bounty} childBounty={childBounty} />
                <RejectChildBountyCuratorMenuItem bounty={bounty} childBounty={childBounty} />
                <CloseChildBountyMenuItem bounty={bounty} childBounty={childBounty} />
                <AwardChildBountyMenuItem childBounty={childBounty} bounty={bounty} />
            </OptionsButton>
        </>
    )
}

export default ChildBountyOptionsButton
