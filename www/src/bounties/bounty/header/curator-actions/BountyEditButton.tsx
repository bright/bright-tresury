import EditButton from '../../../../components/header/details/EditButton'
import React from 'react'
import { generatePath } from 'react-router-dom'
import { ROUTE_EDIT_BOUNTY } from '../../../../routes/routes'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import { useBounty } from '../../useBounty'
import { BountyDto } from '../../../bounties.dto'

interface OwnProps {
    bounty: BountyDto
}

export type BountyEditButtonProps = OwnProps

const BountyEditButton = ({ bounty }: BountyEditButtonProps) => {
    const { hasDetails } = useBounty(bounty)
    const { t } = useTranslation()
    const history = useHistory()

    const navigateToEdit = () => {
        history.push(generatePath(ROUTE_EDIT_BOUNTY, { bountyIndex: bounty.blockchainIndex }))
    }

    return (
        <EditButton
            label={hasDetails ? t('bounty.info.editButton') : t('bounty.info.addDetailsButton')}
            onClick={navigateToEdit}
        />
    )
}

export default BountyEditButton
