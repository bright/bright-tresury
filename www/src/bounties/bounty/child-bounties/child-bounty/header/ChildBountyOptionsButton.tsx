import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import { ChildBountyDto } from '../../child-bounties.dto'
import { ClassNameProps } from '../../../../../components/props/className.props'
import { useMenu } from '../../../../../hook/useMenu'
import OptionsButton from '../../../../../components/header/details/OptionsButton'
import { ROUTE_ASSIGN_CHILD_BOUNTY_CURATOR } from '../../../../../routes/routes'
import MenuItem from '../../../../../main/top-bar/account/MenuItem'
import { useChildBounty } from '../../useChildBounty'
import { Nil } from '../../../../../util/types'
import { PublicUserDto } from '../../../../../util/publicUser.dto'
import { useAuth } from '../../../../../auth/AuthContext'

interface OwnProps {
    childBounty: ChildBountyDto
    bountyCurator: Nil<PublicUserDto>
}

export type ChildBountyOptionsButtonProps = OwnProps & ClassNameProps

const ChildBountyOptionsButton = ({ className, childBounty, bountyCurator }: ChildBountyOptionsButtonProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const { hasWeb3AddressAssigned } = useAuth()
    const { anchorEl, open, handleClose, handleOpen } = useMenu()

    const { hasCurator } = useChildBounty(childBounty)

    const canAssignCurator = useMemo(() => !hasCurator && hasWeb3AddressAssigned(bountyCurator?.web3address), [
        hasCurator,
        bountyCurator,
    ])

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
