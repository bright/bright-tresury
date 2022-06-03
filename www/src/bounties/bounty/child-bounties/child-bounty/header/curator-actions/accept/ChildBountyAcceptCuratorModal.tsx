import { ChildBountyDto } from '../../../../child-bounties.dto'
import Modal from '../../../../../../../components/modal/Modal'
import SubmittingTransaction from '../../../../../../../substrate-lib/components/SubmittingTransaction'
import { Trans, useTranslation } from 'react-i18next'
import Strong from '../../../../../../../components/strong/Strong'
import React from 'react'

interface OwnProps {
    open: boolean
    onClose: () => void
    childBounty: ChildBountyDto
}
export type ChildBountyAcceptCuratorModalProps = OwnProps
const ChildBountyAcceptCuratorModal = ({ open, onClose, childBounty }: ChildBountyAcceptCuratorModalProps) => {
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
                title={t('childBounty.acceptCurator.submittingTransaction.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="childBounty.acceptCurator.submittingTransaction.warningMessage"
                        components={{
                            strong: <Strong color={'primary'} />,
                        }}
                    />
                }
                onSuccess={onClose}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'childBounties',
                    callable: 'acceptCurator',
                    eventSection: 'system',
                    eventMethod: 'ExtrinsicSuccess',
                    eventDescription: t('childBounty.acceptCurator.submittingTransaction.eventDescription'),
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
export default ChildBountyAcceptCuratorModal
