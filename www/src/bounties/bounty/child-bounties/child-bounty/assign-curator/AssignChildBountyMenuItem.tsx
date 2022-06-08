import MenuItem from '../../../../../main/top-bar/account/MenuItem'
import React from 'react'
import { generatePath, useHistory } from 'react-router-dom'
import { ROUTE_ASSIGN_CHILD_BOUNTY_CURATOR } from '../../../../../routes/routes'
import { useTranslation } from 'react-i18next'
import { useBounty } from '../../../useBounty'
import { useChildBounty } from '../../useChildBounty'
import { ChildBountyDto } from '../../child-bounties.dto'
import { BountyDto } from '../../../../bounties.dto'

interface OwnProps {
    childBounty: ChildBountyDto
    bounty: BountyDto
}

export type AssignChildBountyMenuItemProps = OwnProps

const AssignChildBountyMenuItem = ({ childBounty, bounty }: AssignChildBountyMenuItemProps) => {
    const { t } = useTranslation()
    const history = useHistory()

    const { isCurator: isBountyCurator } = useBounty(bounty)
    const { hasCurator } = useChildBounty(bounty, childBounty)
    const canAssignCurator = !hasCurator && isBountyCurator

    const onAssignCuratorClick = () => {
        history.push(
            generatePath(ROUTE_ASSIGN_CHILD_BOUNTY_CURATOR, {
                bountyIndex: childBounty.parentBountyBlockchainIndex,
                childBountyIndex: childBounty.blockchainIndex,
            }),
        )
    }
    return (
        <MenuItem key={'AssignCurator'} onClick={onAssignCuratorClick} disabled={!canAssignCurator}>
            {t('childBounty.header.assignCurator')}
        </MenuItem>
    )
}
export default AssignChildBountyMenuItem
