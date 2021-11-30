import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import OptionsButton from '../../../../components/header/details/OptionsButton'
import { ClassNameProps } from '../../../../components/props/className.props'
import { useMenu } from '../../../../hook/useMenu'
import { ROUTE_AWARD_BOUNTY, ROUTE_EDIT_BOUNTY } from '../../../../routes/routes'
import { BountyDto, BountyStatus } from '../../../bounties.dto'
import { useBounty } from '../../useBounty'
import CuratorRejectMenuItem from '../curator-actions/reject/CuratorRejectMenuItem'

interface OwnProps {
    bounty: BountyDto
}

export type BountyOptionsButtonProps = OwnProps & ClassNameProps

const BountyOptionsButton = ({ className, bounty }: BountyOptionsButtonProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const { anchorEl, open, handleClose, handleOpen } = useMenu()
    const { canEdit, canAward, canReject } = useBounty(bounty)

    const onEditClick = () => {
        history.push(generatePath(ROUTE_EDIT_BOUNTY, { bountyIndex: bounty.blockchainIndex }))
    }

    const onAwardClick = () => {
        history.push(generatePath(ROUTE_AWARD_BOUNTY, { bountyIndex: bounty.blockchainIndex }))
    }

    return (
        <>
            <OptionsButton
                anchorEl={anchorEl}
                open={open}
                handleClose={handleClose}
                handleOpen={handleOpen}
                className={className}
            >
                <MenuItem key={'Edit'} onClick={onEditClick} disabled={!canEdit}>
                    {t('bounty.header.edit')}
                </MenuItem>
                <MenuItem key={'Award'} onClick={onAwardClick} disabled={!canAward}>
                    {t('bounty.header.award')}
                </MenuItem>
                {canReject && bounty.status !== BountyStatus.CuratorProposed ? (
                    <CuratorRejectMenuItem bounty={bounty} />
                ) : null}
            </OptionsButton>
        </>
    )
}

export default BountyOptionsButton
