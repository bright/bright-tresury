import SubmittingTransaction from '../../../substrate-lib/components/SubmittingTransaction'
import { Trans, useTranslation } from 'react-i18next'
import Modal from '../../../components/modal/Modal'
import React from 'react'
import { generatePath } from 'react-router'
import { ROUTE_TIPS } from '../../../routes/routes'
import { useHistory } from 'react-router-dom'
import { TipDto } from '../../tips.dto'
import { useSnackNotifications } from '../../../snack-notifications/useSnackNotifications'
interface OwnProps {
    tip: TipDto
    visible: boolean
    onClose: () => void
}

export type TipPayoutModalProps = OwnProps
const TipPayoutModal = ({ visible, onClose, tip }: TipPayoutModalProps) => {
    const history = useHistory()
    const { t } = useTranslation()
    const snackNotifications = useSnackNotifications()
    const onSuccess = () => {
        snackNotifications.open(t('tip.tipPayout.submitModal.successMessage'))
        history.push(generatePath(ROUTE_TIPS))
    }
    return (
        <Modal
            open={visible}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            fullWidth={true}
            maxWidth={'sm'}
        >
            <SubmittingTransaction
                title={t('tip.tipPayout.submitModal.title')}
                instruction={<Trans id="modal-description" i18nKey="tip.tipPayout.submitModal.warningMessage" />}
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'tips',
                    callable: 'closeTip',
                    eventMethod: 'TipClosed',
                    eventDescription: t('tip.tipPayout.submitModal.eventDescription'),
                    inputParams: [
                        {
                            name: 'hash',
                            value: tip.hash,
                        },
                    ],
                }}
            />
        </Modal>
    )
}
export default TipPayoutModal
