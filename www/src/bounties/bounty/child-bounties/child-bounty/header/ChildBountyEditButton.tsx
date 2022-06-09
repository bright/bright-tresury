import React from 'react'
import { generatePath } from 'react-router-dom'
import { ChildBountyDto } from '../../child-bounties.dto'
import { useChildBounty } from '../../useChildBounty'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import EditButton from '../../../../../components/header/details/EditButton'
import { ROUTE_EDIT_CHILD_BOUNTY } from '../../../../../routes/routes'
import { BountyDto } from '../../../../bounties.dto'

interface OwnProps {
    childBounty: ChildBountyDto
    bounty: BountyDto
}

export type ChildBountyEditButtonProps = OwnProps

const ChildBountyEditButton = ({ childBounty, bounty }: ChildBountyEditButtonProps) => {
    const { hasDetails } = useChildBounty(bounty, childBounty)
    const { t } = useTranslation()
    const history = useHistory()

    const navigateToEdit = () => {
        history.push(
            generatePath(ROUTE_EDIT_CHILD_BOUNTY, {
                bountyIndex: childBounty.parentBountyBlockchainIndex,
                childBountyIndex: childBounty.blockchainIndex,
            }),
        )
    }

    return (
        <EditButton
            label={hasDetails ? t('childBounty.info.editButton') : t('childBounty.info.addDetailsButton')}
            onClick={navigateToEdit}
        />
    )
}

export default ChildBountyEditButton
