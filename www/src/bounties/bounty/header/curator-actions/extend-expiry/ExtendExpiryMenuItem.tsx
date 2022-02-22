import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import { ROUTE_EXTEND_EXPIRY_BOUNTY } from '../../../../../routes/routes'
import { BountyDto } from '../../../../bounties.dto'
import { useBounty } from '../../../useBounty'

interface OwnProps {
    bounty: BountyDto
}

export type ExtendExpiryMenuItemProps = OwnProps

const ExtendExpiryMenuItem = ({ bounty }: ExtendExpiryMenuItemProps) => {
    const { t } = useTranslation()
    const { canExtendExpiry } = useBounty(bounty)
    const history = useHistory()

    const onClick = () => {
        history.push(generatePath(ROUTE_EXTEND_EXPIRY_BOUNTY, { bountyIndex: bounty.blockchainIndex }))
    }

    return (
        <MenuItem key={'ExtendExpiry'} onClick={onClick} disabled={!canExtendExpiry}>
            {t('bounty.header.extendExpiry')}
        </MenuItem>
    )
}

export default ExtendExpiryMenuItem
