import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import Modal from '../../../../../components/modal/Modal'
import Strong from '../../../../../components/strong/Strong'
import { ROUTE_BOUNTY } from '../../../../../routes/routes'
import SubmittingTransaction from '../../../../../substrate-lib/components/SubmittingTransaction'

interface OwnProps {
    open: boolean
    onClose: () => void
    beneficiary: string
    blockchainIndex: number
}

export type AwardModalProps = OwnProps

const AwardModal = ({ open, onClose, beneficiary, blockchainIndex }: AwardModalProps) => {
    const { t } = useTranslation()
    const history = useHistory()

    const onSuccess = async () => {
        debugger
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
                title={t('bounty.info.curatorActions.awardModal.title')}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="bounty.info.curatorActions.awardModal.warningMessage"
                        values={{
                            beneficiary: beneficiary,
                        }}
                        components={{
                            strong: <Strong color={'primary'} />,
                        }}
                    />
                }
                onSuccess={onSuccess}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'bounties',
                    callable: 'awardBounty',
                    eventMethod: 'BountyAwarded',
                    eventDescription: t('bounty.info.curatorActions.awardModal.eventDescription'),
                    inputParams: [
                        {
                            name: 'bountyId',
                            value: blockchainIndex.toString(),
                        },
                        {
                            name: 'beneficiary',
                            value: beneficiary,
                        },
                    ],
                }}
            />
        </Modal>
    )
}

export default AwardModal
