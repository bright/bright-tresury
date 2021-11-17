import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { useHistory } from 'react-router-dom'
import Modal from '../../../../components/modal/Modal'
import Strong from '../../../../components/strong/Strong'
import { useNetworks } from '../../../../networks/useNetworks'
import SubmittingTransaction from '../../../../substrate-lib/components/SubmittingTransaction'
import { BOUNTY_QUERY_KEY_BASE, useGetBounty } from '../../../bounties.api'
import { BountyDto } from '../../../bounties.dto'

interface OwnProps {
    open: boolean
    onClose: () => void
    bounty: BountyDto
}

export type RejectCuratorModalProps = OwnProps

const RejectCuratorModal = ({ open, onClose, bounty }: RejectCuratorModalProps) => {
    const { t } = useTranslation()
    const { network } = useNetworks()
    const { refetch } = useGetBounty({ bountyIndex: bounty.blockchainIndex.toString(), network: network.id })

    const onSuccess = async () => {
        await refetch()
        onClose()
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
                title={t('bounty.info.curatorActions.rejectModal.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="bounty.info.curatorActions.rejectModal.warningMessage"
                        components={{
                            strong: <Strong color={'primary'} />,
                        }}
                    />
                }
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'bounties',
                    callable: 'unassignCurator',
                    eventMethod: 'BountyBecameActive',
                    eventDescription: t('bounty.info.curatorActions.rejectModal.eventDescription'),
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

export default RejectCuratorModal
