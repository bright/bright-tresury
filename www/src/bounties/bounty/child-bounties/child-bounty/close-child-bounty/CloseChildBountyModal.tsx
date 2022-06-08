import { ChildBountyDto } from '../../child-bounties.dto'
import Modal from '../../../../../components/modal/Modal'
import SubmittingTransaction from '../../../../../substrate-lib/components/SubmittingTransaction'
import { useTranslation } from 'react-i18next'
import React from 'react'

interface OwnProps {
    open: boolean
    onClose: () => void
    onSuccess: () => any
    childBounty: ChildBountyDto
}
export type CloseChildBountyModalProps = OwnProps
const CloseChildBountyModal = ({ open, onClose, onSuccess, childBounty }: CloseChildBountyModalProps) => {
    const { t } = useTranslation()
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
                title={t('childBounty.closeChildBounty.submittingTransaction.title')}
                instruction={t('childBounty.closeChildBounty.submittingTransaction.warningMessage')}
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'childBounties',
                    callable: 'closeChildBounty',
                    eventMethod: 'Canceled',
                    inputParams: [
                        {
                            name: 'parentBountyId',
                            value: childBounty.parentBountyBlockchainIndex.toString(),
                        },
                        {
                            name: 'childBountyId',
                            value: childBounty.blockchainIndex.toString(),
                        },
                    ],
                }}
            />
        </Modal>
    )
}
export default CloseChildBountyModal
