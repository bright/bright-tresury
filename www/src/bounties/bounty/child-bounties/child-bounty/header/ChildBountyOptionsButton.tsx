import React from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import { ChildBountyDto } from '../../child-bounties.dto'
import { ClassNameProps } from '../../../../../components/props/className.props'
import { useMenu } from '../../../../../hook/useMenu'
import OptionsButton from '../../../../../components/header/details/OptionsButton'
import { ROUTE_ASSIGN_CHILD_BOUNTY_CURATOR } from '../../../../../routes/routes'
import MenuItem from '../../../../../main/top-bar/account/MenuItem'

interface OwnProps {
    childBounty: ChildBountyDto
}

export type ChildBountyOptionsButtonProps = OwnProps & ClassNameProps

const ChildBountyOptionsButton = ({ className, childBounty }: ChildBountyOptionsButtonProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const { anchorEl, open, handleClose, handleOpen } = useMenu()

    const canAssignCurator = true

    const onAssignCuratorClick = () => {
        history.push(
            generatePath(ROUTE_ASSIGN_CHILD_BOUNTY_CURATOR, {
                bountyIndex: childBounty.parentBountyBlockchainIndex,
                childBountyIndex: childBounty.blockchainIndex,
            }),
        )
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
                <MenuItem key={'AssignCurator'} onClick={onAssignCuratorClick} disabled={!canAssignCurator}>
                    {t('childBounty.header.assignCurator')}
                </MenuItem>
            </OptionsButton>
        </>
    )
}

export default ChildBountyOptionsButton
