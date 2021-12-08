import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import { ROUTE_AWARD_BOUNTY } from '../../../../../routes/routes'
import { BountyDto } from '../../../../bounties.dto'
import { useBounty } from '../../../useBounty'

interface OwnProps {
    bounty: BountyDto
}

export type AwardMenuItemProps = OwnProps

const AwardMenuItem = ({ bounty }: AwardMenuItemProps) => {
    const { t } = useTranslation()
    const { canAward } = useBounty(bounty)
    const history = useHistory()

    const onClick = () => {
        history.push(generatePath(ROUTE_AWARD_BOUNTY, { bountyIndex: bounty.blockchainIndex }))
    }

    return (
        <MenuItem key={'Award'} onClick={onClick} disabled={!canAward}>
            {t('bounty.header.award')}
        </MenuItem>
    )
}

export default AwardMenuItem
