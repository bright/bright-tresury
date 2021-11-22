import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import OptionsButton from '../../../../components/header/details/OptionsButton'
import { ClassNameProps } from '../../../../components/props/className.props'
import { useMenu } from '../../../../hook/useMenu'
import { ROUTE_EDIT_BOUNTY, ROUTE_EDIT_IDEA } from '../../../../routes/routes'
import { BountyDto } from '../../../bounties.dto'
import { useBounty } from '../../useBounty'

interface OwnProps {
    bounty: BountyDto
}

export type BountyOptionsButtonProps = OwnProps & ClassNameProps

const BountyOptionsButton = ({ className, bounty }: BountyOptionsButtonProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const { anchorEl, open, handleClose, handleOpen } = useMenu()
    const { canEdit } = useBounty(bounty)

    const onEditClick = () => {
        history.push(generatePath(ROUTE_EDIT_BOUNTY, { bountyIndex: bounty.blockchainIndex }))
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
            </OptionsButton>
        </>
    )
}

export default BountyOptionsButton
