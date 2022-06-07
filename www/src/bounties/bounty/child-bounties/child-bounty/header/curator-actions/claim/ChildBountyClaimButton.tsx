import { useTranslation } from 'react-i18next'
import { useModal } from '../../../../../../../components/modal/useModal'
import { SuccessButton } from '../../../../../../../components/button/Button'
import React from 'react'
import { ChildBountyDto } from '../../../../child-bounties.dto'
import ChildBountyClaimModal from './ChildBountyClaimModal'
import { useSnackNotifications } from '../../../../../../../snack-notifications/useSnackNotifications'
import { generatePath, useHistory } from 'react-router'
import { ROUTE_CHILD_BOUNTIES } from '../../../../../../../routes/routes'

interface OwnProps {
    childBounty: ChildBountyDto
}
export type ChildBountyClaimButtonProps = OwnProps

const ChildBountyClaimButton = ({ childBounty }: ChildBountyClaimButtonProps) => {
    const { t } = useTranslation()
    const { open, visible, close } = useModal()
    const history = useHistory()
    const snackNotifications = useSnackNotifications()
    const onSuccessWithClose = async () => {
        history.push(generatePath(ROUTE_CHILD_BOUNTIES, { bountyIndex: childBounty.parentBountyBlockchainIndex }))
        snackNotifications.open(t('childBounty.claimPayout.submittingTransaction.successMessage'))
        close()
    }
    return (
        <>
            <SuccessButton variant="contained" color="primary" onClick={open}>
                {t('childBounty.header.claimPayout')}
            </SuccessButton>
            <ChildBountyClaimModal
                open={visible}
                onClose={close}
                childBounty={childBounty}
                onSuccess={onSuccessWithClose}
            />
        </>
    )
}

export default ChildBountyClaimButton
