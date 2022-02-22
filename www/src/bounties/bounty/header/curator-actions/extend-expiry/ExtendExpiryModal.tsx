import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import Modal from '../../../../../components/modal/Modal'
import Strong from '../../../../../components/strong/Strong'
import { ROUTE_BOUNTY } from '../../../../../routes/routes'
import { useSnackNotifications } from '../../../../../snack-notifications/useSnackNotifications'
import SubmittingTransaction from '../../../../../substrate-lib/components/SubmittingTransaction'

interface OwnProps {
    open: boolean
    onClose: () => void
    blockchainIndex: number
    remark: string
}

export type ExtendExpiryModalProps = OwnProps

const ExtendExpiryModal = ({ open, onClose, blockchainIndex, remark }: ExtendExpiryModalProps) => {
    const { t } = useTranslation()
    const history = useHistory()
    const snackNotifications = useSnackNotifications()

    const onSuccess = async () => {
        snackNotifications.open(t('bounty.info.curatorActions.extendExpiry.successMessage'))
        history.push(generatePath(ROUTE_BOUNTY, { bountyIndex: blockchainIndex }))
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
                title={t('bounty.info.curatorActions.extendExpiry.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="bounty.info.curatorActions.extendExpiry.warningMessage"
                        components={{
                            strong: <Strong color={'primary'} />,
                        }}
                    />
                }
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'bounties',
                    callable: 'extendBountyExpiry',
                    eventMethod: 'BountyExtended',
                    eventDescription: t('bounty.info.curatorActions.extendExpiry.eventDescription'),
                    inputParams: [
                        {
                            name: 'bountyId',
                            value: blockchainIndex.toString(),
                        },
                        {
                            name: 'remark',
                            value: remark,
                        },
                    ],
                }}
            />
        </Modal>
    )
}

export default ExtendExpiryModal
