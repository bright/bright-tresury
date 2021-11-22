import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Modal from '../../../../../components/modal/Modal'
import Strong from '../../../../../components/strong/Strong'
import { useNetworks } from '../../../../../networks/useNetworks'
import SubmittingTransaction from '../../../../../substrate-lib/components/SubmittingTransaction'
import { useGetBounty } from '../../../../bounties.api'
import { BountyDto } from '../../../../bounties.dto'

interface OwnProps {
    open: boolean
    onClose: () => void
    bounty: BountyDto
}

export type AcceptCuratorModalProps = OwnProps

const AcceptCuratorModal = ({ open, onClose, bounty }: AcceptCuratorModalProps) => {
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
                title={t('bounty.info.curatorActions.acceptModal.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="bounty.info.curatorActions.acceptModal.warningMessage"
                        components={{
                            strong: <Strong color={'primary'} />,
                        }}
                    />
                }
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'bounties',
                    callable: 'acceptCurator',
                    eventMethod: 'BountyBecameActive',
                    eventDescription: t('bounty.info.curatorActions.acceptModal.eventDescription'),
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

export default AcceptCuratorModal
