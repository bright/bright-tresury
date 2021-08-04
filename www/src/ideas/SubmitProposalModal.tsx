import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import Modal from '../components/modal/Modal'
import Strong from '../components/strong/Strong'
import { ROUTE_PROPOSALS } from '../routes/routes'
import SubmittingTransaction from '../substrate-lib/components/SubmittingTransaction'

export interface ExtrinsicDetails {
    extrinsicHash: string
    lastBlockHash: string
}

interface OwnProps {
    open: boolean
    onClose: () => void
    onTurn: (extrinsicDetails: ExtrinsicDetails) => Promise<void>
    title: string
    value: number
    beneficiary: string
}

export type SubmitProposalModalProps = OwnProps

const SubmitProposalModal = ({ open, onClose, onTurn, title, value, beneficiary }: SubmitProposalModalProps) => {
    const { t } = useTranslation()

    const history = useHistory()

    const goToProposals = () => {
        history.push(ROUTE_PROPOSALS)
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
                title={title}
                instruction={
                    <Trans
                        id="modal-description"
                        i18nKey="idea.details.submitProposalModal.warningMessage"
                        components={{
                            strong: <Strong color={'primary'} />,
                        }}
                    />
                }
                onSuccess={goToProposals}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'treasury',
                    callable: 'proposeSpend',
                    eventMethod: 'Proposed',
                    eventDescription: t('idea.details.submitProposalModal.eventDescription'),
                    inputParams: [
                        {
                            name: 'value',
                            value: value.toString(),
                            type: 'Compact<Balance>',
                        },
                        {
                            name: 'beneficiary',
                            value: beneficiary,
                        },
                    ],
                }}
                onTransactionSigned={onTurn}
            />
        </Modal>
    )
}

export default SubmitProposalModal
