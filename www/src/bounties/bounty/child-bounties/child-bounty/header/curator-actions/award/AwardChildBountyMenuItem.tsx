import { BountyDto } from '../../../../../../bounties.dto'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import { ROUTE_AWARD_CHILD_BOUNTY } from '../../../../../../../routes/routes'
import React from 'react'
import { ChildBountyDto } from '../../../../child-bounties.dto'
import { useChildBounty } from '../../../../useChildBounty'
import MenuItem from '../../../../../../../main/top-bar/account/MenuItem'

interface OwnProps {
    childBounty: ChildBountyDto
    bounty: BountyDto
}

export type AwardChildBountyMenuItemProps = OwnProps

const AwardChildBountyMenuItem = ({ childBounty, bounty }: AwardChildBountyMenuItemProps) => {
    const { t } = useTranslation()
    const { canAward } = useChildBounty(bounty, childBounty)
    const history = useHistory()

    const onClick = () => {
        history.push(
            generatePath(ROUTE_AWARD_CHILD_BOUNTY, {
                bountyIndex: childBounty.parentBountyBlockchainIndex,
                childBountyIndex: childBounty.blockchainIndex,
            }),
        )
    }

    return (
        <MenuItem key={'Award'} onClick={onClick} disabled={!canAward}>
            {t('childBounty.header.award')}
        </MenuItem>
    )
}

export default AwardChildBountyMenuItem
