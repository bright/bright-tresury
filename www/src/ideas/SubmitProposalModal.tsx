import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { generatePath, useHistory } from 'react-router-dom'
import Modal from '../components/modal/Modal'
import Strong from '../components/strong/Strong'
import { ROUTE_PROPOSAL, ROUTE_PROPOSALS } from '../routes/routes'
import SubmittingTransaction, { ExtrinsicDetails } from '../substrate-lib/components/SubmittingTransaction'
import { NetworkPlanckValue } from '../util/types'

interface OwnProps {
    open: boolean
    onClose: () => void
    onTurn: (extrinsicDetails: ExtrinsicDetails) => Promise<void>
    title: string
    value: NetworkPlanckValue
    beneficiary: string
}

export type SubmitProposalModalProps = OwnProps

const SubmitProposalModal = ({ open, onClose, onTurn, title, value, beneficiary }: SubmitProposalModalProps) => {
    const { t } = useTranslation()

    const history = useHistory()

    const goToProposal = (event?: any) => {
        const proposalIndex = event?.data?.toJSON()?.[0]
        proposalIndex !== undefined
            ? history.push(generatePath(ROUTE_PROPOSAL, { proposalIndex }), { share: true })
            : history.push(ROUTE_PROPOSALS)
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
                onSuccess={goToProposal}
                onClose={onClose}
                txAttrs={{
                    palletRpc: 'treasury',
                    callable: 'proposeSpend',
                    eventMethod: 'Proposed',
                    eventDescription: t('idea.details.submitProposalModal.eventDescription'),
                    inputParams: [
                        {
                            name: 'value',
                            value: value,
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
