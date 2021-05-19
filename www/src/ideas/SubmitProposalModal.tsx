import React, { useCallback, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Strong } from '../components/info/Info'
import { Modal } from '../components/modal/Modal'
import SubmittingTransaction from '../substrate-lib/components/SubmittingTransaction'
import { ROUTE_PROPOSALS } from '../routes/routes'
import { useHistory } from 'react-router-dom'

export interface ExtrinsicDetails {
    extrinsicHash: string
    lastBlockHash: string
}

interface Props {
    open: boolean
    onClose: () => void
    onTurn: (extrinsicDetails: ExtrinsicDetails) => void
    title: string
    value: number
    beneficiary: string
}

export const SubmitProposalModal = ({ open, onClose, onTurn, title, value, beneficiary }: Props) => {
    const { t } = useTranslation()

    const history = useHistory()

    const [extrinsicDetails, setExtrinsicDetails] = useState<ExtrinsicDetails | undefined>(undefined)

    const turn = useCallback(() => {
        if (extrinsicDetails) {
            onTurn(extrinsicDetails)
        }
    }, [extrinsicDetails, onTurn])

    useEffect(() => {
        turn()
    }, [turn])

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
                setExtrinsicDetails={setExtrinsicDetails}
            />
        </Modal>
    )
}
