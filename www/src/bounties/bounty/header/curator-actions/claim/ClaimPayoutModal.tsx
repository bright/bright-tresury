import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import Modal from '../../../../../components/modal/Modal'
import Strong from '../../../../../components/strong/Strong'
import { ROUTE_BOUNTIES } from '../../../../../routes/routes'
import { useSnackNotifications } from '../../../../../snack-notifications/useSnackNotifications'
import SubmittingTransaction from '../../../../../substrate-lib/components/SubmittingTransaction'
import { BountyDto } from '../../../../bounties.dto'

interface OwnProps {
    open: boolean
    onClose: () => void
    bounty: BountyDto
}

export type ClaimPayoutModalProps = OwnProps

const ClaimPayoutModal = ({ open, onClose, bounty }: ClaimPayoutModalProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const snackNotifications = useSnackNotifications()

    const onSuccess = async () => {
        snackNotifications.open(t('bounty.info.curatorActions.claimPayoutModal.successMessage'))
        history.push(ROUTE_BOUNTIES)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            fullWidth={true}
            maxWidth={'sm'}
        >
            <SubmittingTransaction
                title={t('bounty.info.curatorActions.claimPayoutModal.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="bounty.info.curatorActions.claimPayoutModal.warningMessage"
                        components={{
                            strong: <Strong color={'primary'} />,
                        }}
                    />
                }
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'bounties',
                    callable: 'claimBounty',
                    eventMethod: 'BountyClaimed',
                    eventDescription: t('bounty.info.curatorActions.claimPayoutModal.eventDescription'),
                    inputParams: [
                        {
                            name: 'bountyId',
                            value: bounty.blockchainIndex.toString(),
                        },
                    ],
                }}
            />
        </Modal>
    )
}

export default ClaimPayoutModal
